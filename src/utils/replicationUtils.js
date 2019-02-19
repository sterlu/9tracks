module.exports.cleanSongName = (name) => {
  return name
    .replace(' - Recorded at Spotify Studios NYC', '')
    .replace(/\(.*\)/g, '');
};
