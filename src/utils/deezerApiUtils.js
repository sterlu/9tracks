module.exports.searchLink = (artist, track) =>
  `https://api.deezer.com/search?q=artist:"${encodeURIComponent(artist)}" track:"${encodeURIComponent(track)}"`;
