module.exports.apiLink = (id) => `https://api.reddit.com/comments/${id}?depth=1`;

module.exports.threadTags = (threadId) => {
  const tags = [];
  const spotifyMonthlyCompetitions = {
    'aw5680': 'Small Artists',
    'am1787': 'Crosstown',
    'aedlf5': 'Local Meltdown',
    '9f7p3o': 'Short Stuff',
    '948mgy': 'Undiscovered',
    '8vhzzs': 'Live',
    '8nq8v1': 'Questions?',
    '8gh3q4': 'The name game',
    '8borze': 'Party tunes',
    'b7w1js': 'Reckless Serenade',
  };
  console.log(spotifyMonthlyCompetitions[threadId])
  if (spotifyMonthlyCompetitions[threadId])
    tags.push(spotifyMonthlyCompetitions[threadId], 'competition');
  return tags;
};
