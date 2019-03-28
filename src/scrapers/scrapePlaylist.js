const fetch = require('node-fetch');
const spotify = require('../utils/spotifyApiUtils');
const storage = require('../utils/storage');
const reddit = require('../utils/redditApiUtils');

const scrapePlaylist = async () => {
  if (process.argv.length < 3)
    throw new Error('No playlist ID provided');

  const playlistId = process.argv[2];

  const currentData = await storage.getPlaylist(playlistId);
  if (currentData && currentData.data_updated.valueOf() > (Date.now() - (0.1 * 24 * 60 * 60 * 1000)))
    return;

  const response = await fetch(spotify.playlistLink(playlistId), {
    headers: {
      authorization: `Bearer ${(await spotify.getAccessToken())}`, // TODO cache token
    }
  });
  const data = await response.json();
  if (data.error) {
    if (data.error.message === 'Not found.') return;
    throw new Error(data.error.message);
  }

  if (data.tracks.total === 0)
    return;

  const playlist = {};

  playlist.source = 'spotify';
  playlist.name = data.name;
  playlist.description = data.description;
  playlist.id = data.id;
  playlist.images = data.images;
  playlist.cover = (data.images && data.images.length && data.images[0].url);
  playlist.tracks = data.tracks.items.map(item => item.track.id);
  playlist.totalTracks = data.tracks.total;
  playlist.creatorId = data.owner.id;

  const jobData = await storage.getJobForTarget(playlistId);
  if (jobData && jobData.source)
    playlist.tags = reddit.threadTags(JSON.parse(jobData.source).thread);
  let updated = new Date(0);
  let created = new Date(8640000000000000);
  for (const track of data.tracks.items) {
    const added = new Date(track.added_at);
    if (added > updated) updated = added;
    if (added < created) created = added;
  }
  playlist.updated = updated;
  playlist.created = created;
  console.log(`Scraped "${playlist.name}" by ${playlist.creatorId}`);
  await storage.addPlaylist(playlist);
  await storage.enqueueSpotifyCreator(playlist.creatorId)
};

scrapePlaylist()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
