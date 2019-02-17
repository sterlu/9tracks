const fs = require('fs');
const path = require('path');
const http = require('http');
const express = require('express');
const storage = require('./utils/storage');
const renderer = require('./utils/renderer');

const isProd = process.env.NODE_ENV === 'production';

const app = express();

app.use(function (req, res, next) {
  (isProd && !req.secure)
    ? res.redirect('https://' + req.headers.host + req.url)
    : next();
});

app.use('/public', express.static(path.join(__dirname, '../build')));

app.get('/', async (req, res) => {
  const playlists = (await storage.getPlaylists())
    .map((playlist) => {
      delete playlist.tracks.items;
      return playlist;
    });
  fs.readFile('./build/index.html', 'utf8', (err, indexHtml) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }
    const App = require('../build/main');
    return res.send(
      indexHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${renderer(App.default || App, { playlists: playlists.slice(0, 12) })}</div>`
        + `<script>window.playlists = ${JSON.stringify(playlists)}</script>`
      )
    );
  });
});

const httpServer = http.createServer(app);
httpServer.listen(80);

if (isProd) {
  const https = require('https');
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/9tracks.tk/privkey.pem', 'utf8');
  const certificate = fs.readFileSync('/etc/letsencrypt/live/9tracks.tk/cert.pem', 'utf8');
  const ca = fs.readFileSync('/etc/letsencrypt/live/9tracks.tk/chain.pem', 'utf8');

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443);
}

