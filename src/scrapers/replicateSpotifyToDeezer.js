const fetch = require('node-fetch');

const deezer = require('../utils/deezerApiUtils');
const storage = require('../utils/storage_permanentConnection');
const { cleanSongName } = require('../utils/replicationUtils');

const replicateSpotifyToDeezer = async () => {
  if (process.argv.length < 3)
    throw new Error('No playlist ID provided');

  const playlistId = process.argv[2];

  const playlistData = await storage.getPlaylist(playlistId);

  const replicatedTracks = [];

  for (const track of playlistData.tracks.spotify.items) {
    const response = await fetch(deezer.searchLink(track.artist, cleanSongName(track.name)));
    const data = await response.json();
    if (!data.data) throw JSON.stringify(data);
    if (data.data.length) {
      const found = data.data[0];
      replicatedTracks.push(found.id);
    } else {
      console.error('No data for ', track.artists[0].name, cleanSongName(track.name));
    }
  }

  await storage.addPlaylistInfo({
    id: playlistId,
    tracks: {
      spotify: playlistData.tracks.spotify,
      deezer: {
        total: replicatedTracks.length,
        items: replicatedTracks
      }
    },
  });

  storage.endConnection();
};

replicateSpotifyToDeezer()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
