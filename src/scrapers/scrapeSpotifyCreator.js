const fetch = require('node-fetch');
const spotify = require('../utils/spotifyApiUtils');
const storage = require('../utils/storage');

const scrapeSpotifyCreator = async () => {
  if (process.argv.length < 3)
    throw new Error('No playlist ID provided');

  const userId = process.argv[2];

  const currentData = await storage.getCreator(userId);
  if (currentData && currentData.data_updated.valueOf() > (Date.now() - (14 * 24 * 60 * 60 * 1000)))
    return;

  const response = await fetch(spotify.userLink(userId), {
    headers: {
      authorization: `Bearer ${(await spotify.getAccessToken())}`, // TODO cache token
    }
  });
  const data = await response.json();

  if (data.error)
    throw new Error(data.error.message);

  const creator = {
    id: data.id,
    name: data.display_name,
  };

  await storage.addCreator(creator);
};

scrapeSpotifyCreator()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
