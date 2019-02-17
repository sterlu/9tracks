const fetch = require('node-fetch');
const storage = require('../utils/storage');

if (process.argv.length < 3)
  throw new Error('No thread ID provided');

const apiLink = (id) => `https://api.reddit.com/comments/${id}?depth=1`;

const threadId = process.argv[2];

const playlistUrlRegex = /https:\/\/open\.spotify\.com\/user\/[^/]*\/playlist\/[\w]*/;

(async function () {
  const response = await fetch(apiLink(threadId));
  const data = await response.json();
  const comments = data[1].data.children;
  for (const comment of comments) {
    const match = comment.data.body_html.match(playlistUrlRegex);
    if (match) {
      console.log(match[0]);
      const playlistId = match[0].substr(-22);
      storage.addLinkToScrape(playlistId, { thread: threadId, comment: comment.data.id });
    }
    // if (!match) console.log(comment.data.body)
  }
})();
