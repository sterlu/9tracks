const fetch = require('node-fetch');
const spotify = require('../utils/spotifyApiUtils');
const storage = require('../utils/storage_permanentConnection');
const reddit = require('../utils/redditApiUtils');

const getAccessToken = async () => {
  // check db
  const response = await fetch(spotify.accessTokenLink(), {
    method: 'POST',
    headers: {
      authorization: 'Basic YWFjNmVmNWIyNzFiNGQxNDk3NDRiNmU3YTE1ODlhYzM6YWRkZTBhYzE3ZmIzNGMyN2FmODczNDQ1OWU1ZWM5YWE',
      'content-type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  if (data.error)
    throw new Error(data.error_description);
  // store in db
  return data.access_token;
};

const scrapePlaylist = async () => {
  if (process.argv.length < 3)
    throw new Error('No playlist ID provided');

  const playlistId = process.argv[2];

  const response = await fetch(spotify.playlistLink(playlistId), {
    headers: {
      authorization: `Bearer ${(await getAccessToken())}`, // TODO cache token
    }
  });
  const data = await response.json();
  if (data.error)
    throw new Error(data.error.message);

  if (data.tracks.total === 0)
    return;

  const playlist = {};

  playlist.source = 'spotify';
  playlist.name = data.name;
  playlist.description = data.description;
  playlist.id = data.id;
  playlist.spotifyId = data.id;
  playlist.images = data.images;
  playlist.cover = (data.images && data.images.length && data.images[0].url);
  playlist.owner = {
    name: data.owner.display_name,
    id: data.owner.id,
  };
  playlist.tracks = {
    spotify: {
      total: data.tracks.total,
      items: data.tracks.items.map((item) => ({
        name: item.track.name,
        artist: item.track.artists[0].name,
        artists: item.track.artists,
        album: item.track.album.name,
      })),
    }
  };

  const extraData = {};
  const jobData = await storage.getJob({ playlistId });
  if (jobData && jobData.source)
    extraData.tag = reddit.threadTags[jobData.source.thread];
  let updated = new Date(0);
  let created = new Date(8640000000000000);
  for (const track of data.tracks.items) {
    const added = new Date(track.added_at);
    if (added > updated) updated = added;
    if (added < created) created = added;
  }
  playlist.updated = updated;
  playlist.created = created;
  console.log(`Scraped "${playlist.name}" by ${playlist.owner.name}`);
  await storage.addPlaylistInfo(playlist, extraData);
  await storage.enqueueSpotifyToDeezerReplication(playlistId);
  storage.endConnection();
};

scrapePlaylist()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
