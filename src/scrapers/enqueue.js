const storage = require('../utils/storage_permanentConnection');

const enqueue = async () => {
  if (process.argv.length < 3)
    throw new Error('No thread ID provided');

  const threadId = process.argv[2];

  await storage.enqueueRedditThread(threadId);

  await storage.endConnection();
};

enqueue()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
