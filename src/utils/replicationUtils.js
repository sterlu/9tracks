module.exports.cleanSongName = (name) => {
  return name
    .replace(' - Recorded at Spotify Studios NYC', '')
    .replace(' - BBC Radio 1 Live Lounge', '')
    .replace(/\(.*\)/g, '');
};
