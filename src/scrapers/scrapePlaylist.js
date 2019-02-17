const fetch = require('node-fetch');
const spotify = require('../utils/spotifyApiUtils');
const storage = require('../utils/storage');

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
    throw new Error('No thread ID provided');

  const playlistId = process.argv[2];

  const response = await fetch(spotify.playlistLink(playlistId), {
    headers: {
      authorization: `Bearer ${(await getAccessToken())}`,
    }
  });
  const data = await response.json();
  if (data.error)
    throw new Error(data.error.message);

  const linkData = await storage.getLink(playlistId);
  data.tags = linkData.source.map(src => ({
    'am1787': 'February competition - Crosstown',
    'aedlf5': 'January competition - The Local Meltdown',
    '9f7p3o': 'September competition - Short Stuff',
    '948mgy': 'August competition - Undiscovered',
    '8vhzzs': 'July competition - Live',
    '8nq8v1': 'June competition - Questions?',
    '8gh3q4': 'May competition - The name game',
    '8borze': 'April competition - Party tunes',
  }[src.thread]));
  let updated = new Date(0);
  for (const track of data.tracks.items) {
    const added = new Date(track.added_at);
    if (added > updated) updated = added;
  }
  data.updated = updated;
  const pName = data.name;
  const pImage = data.images && data.images.length && data.images[0].url;
  const oName = data.owner.display_name;
  console.log(`Scraped "${pName}" by ${oName} \n${pImage}\n`);
  return storage.addPlaylistInfo(data);
};

scrapePlaylist()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
