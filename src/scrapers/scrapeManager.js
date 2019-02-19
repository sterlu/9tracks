const sem = require('semaphore')(10);
const { spawn } = require('child_process');
const storage = require('../utils/storage_permanentConnection');

const runJobs = async () => {
  console.log('Starting scrape manager');
  const jobsCursor = await storage.getJobs();
  while (await jobsCursor.hasNext()) {
    console.log('loop start');
    await new Promise((res, rej) => sem.take(() => res()));
    // (async function () {
    const job = await jobsCursor.next();
    let process;
    switch (job.type) {
      case 'spotify_playlist':
        console.log('Scraping ', job.playlistId);
        process = spawn('node', ['scrapePlaylist.js', job.playlistId]);
        break;
      case 'reddit_thread':
        console.log('Scraping ', job.threadId);
        process = spawn('node', ['scrapeRedditThread.js', job.threadId]);
        break;
      case 'replicate_spotify_to_deezer':
        console.log('Replicating ', job.playlistId);
        process = spawn('node', ['replicateSpotifyToDeezer.js', job.playlistId]);
        break;
      default:
        console.log('Unknown job type: ' + job.type);
        sem.leave();
        break;
    }
    await storage.updateJobStatus(job._id, storage.jobStatus.SCRAPING);
    if (!process) return;
    // process.stdout.on('data', data => console.log(data.toString()));
    process.stderr.on('data', data => console.error(data.toString()));
    process.on('close', async (code) => {
      if (code !== 0)
        console.error('Scrape failed', job);
      await storage.updateJobStatus(job._id, (code === 0) ? storage.jobStatus.SCRAPED : storage.jobStatus.TO_SCRAPE);
      sem.leave();
    });
    // }());
    console.log('loop end');
  }
  jobsCursor.close();
  await storage.endConnection();
  console.log('Done for now');
  setTimeout(runJobs, 10 * 1000);
};

runJobs()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
