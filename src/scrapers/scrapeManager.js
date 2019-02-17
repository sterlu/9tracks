const sem = require('semaphore')(10);
const { spawn } = require('child_process');
const storage = require('../utils/storage');

storage.getLinksToScrape()
  .then((links) => {
    links.forEach(async (link) => {
      sem.take(async () => {
        console.log('Scraping ', link.playlistId);
        await storage.updateLinkStatus(link.url, storage.linkStatus.SCRAPING);
        const process = spawn('node', ['scrapePlaylist.js', link.playlistId]);
        process.stderr.on('data', (data) => {
          console.error(data.toString());
        });
        process.on('close', async (code) => {
          if (code !== 0)
            console.error(`Scrape failed for ${link.playlistId} - code ${code}`);
          await storage.updateLinkStatus(link.playlistId, (code === 0) ? storage.linkStatus.SCRAPED : storage.linkStatus.TO_SCRAPE);
          sem.leave();
        });
      });

    });
  });
