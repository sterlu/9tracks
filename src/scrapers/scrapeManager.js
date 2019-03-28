const sem = require('semaphore')(10);
const { spawn } = require('child_process');

const storage = require('../utils/storage');

const runJobs = async () => {
  const jobs = await storage.getJobs();
  if (jobs.rows.length)
    console.log('New jobs: ', jobs.rows.length);
  for (let i = 0; i < jobs.rows.length; i++) {
    const job = jobs.rows[i];
    await new Promise((res, rej) => sem.take(() => res()));
    let process;
    switch (job.type) {
      case 'spotify_playlist':
        console.log('Scraping ', job.target);
        process = spawn('node', ['src/scrapers/scrapePlaylist.js', job.target]);
        break;
      case 'spotify_creator':
        console.log('Scraping ', job.target);
        process = spawn('node', ['src/scrapers/scrapeSpotifyCreator.js', job.target]);
        break;
      case 'reddit_thread':
        console.log('Scraping ', job.target);
        process = spawn('node', ['src/scrapers/scrapeRedditThread.js', job.target]);
        break;
      default:
        console.log('Unknown job type: ' + job.type);
        sem.leave();
        break;
    }
    await storage.updateJobStatus(job.target, storage.jobStatus.SCRAPING);
    if (!process) return;
    process.stderr.on('data', data => console.error(data.toString()));
    process.on('close', async (code) => {
      if (code !== 0)
        console.error('Scrape failed', job);
      await storage.updateJobStatus(job.target, (code === 0) ? storage.jobStatus.SCRAPED : storage.jobStatus.TO_SCRAPE);
      sem.leave();
    });
  }
  setTimeout(runJobs, 10 * 1000);
};

runJobs()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
