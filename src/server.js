const fs = require('fs');
const path = require('path');
const express = require('express');

const storage = require('./utils/storage');

const renderer = require('./utils/renderer');

const app = express();

app.use('/public', express.static(path.join(__dirname, '../build')));

app.get('/', async (req, res) => {
  const playlists = await storage.getPlaylists();
  fs.readFile('./build/index.html', 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    const App = require('../build/main');
    console.log(App);
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${renderer(App.default || App, { playlists })}</div>`
        + `<script>window.playlists = ${JSON.stringify(playlists)}</script>`
      )
    );
  });
});

app.listen(80);
