const storage = require('../utils/storage');

const enqueue = async () => {
  if (process.argv.length < 3)
    throw new Error('No thread ID provided');

  const threadId = process.argv[2];

  await storage.enqueueRedditThread(threadId);
};

enqueue()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
