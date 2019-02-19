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

  for (const { track } of playlistData.tracks.items) {
    console.log(track.artists[0].name, cleanSongName(track.name));
    console.log(deezer.searchLink(track.artists[0].name, cleanSongName(track.name)));
    const response = await fetch(deezer.searchLink(track.artists[0].name, cleanSongName(track.name)));
    const data = await response.json();
    if (!data.data) throw JSON.stringify(data);
    if (data.data.length) {
      const track = data.data[0];
      console.log(track.artist.name, track.title_short);
      replicatedTracks.push(track.id);
    } else {
      console.error('No data for ', track.artists[0].name, cleanSongName(track.name));
    }
  }

  await storage.addPlaylistInfo({
    id: playlistId,
    deezerTracks: replicatedTracks,
  });

  storage.endConnection();
};

replicateSpotifyToDeezer()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
