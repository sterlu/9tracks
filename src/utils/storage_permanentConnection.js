require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
const dbName = process.env.DB_NAME;

const jobStatus = module.exports.jobStatus = {
  TO_SCRAPE: 0,
  SCRAPING: 1,
  SCRAPED: 2,
};

let client;
let db;

const connect = async () => {
  if (client) return;
  client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  db = client.db(dbName);
};

module.exports.endConnection = async () => {
  client.close();
  client = null;
};

module.exports.enqueueSpotifyPlaylist = async (playlistId, source) => {
  await connect();
  return db.collection('jobs').insertOne({
    type: 'spotify_playlist',
    playlistId,
    status: jobStatus.TO_SCRAPE,
    added_at: new Date(),
    source,
  });
};

module.exports.enqueueRedditThread = async (threadId) => {
  await connect();
  return db.collection('jobs').insertOne({
    type: 'reddit_thread',
    threadId,
    status: jobStatus.TO_SCRAPE,
    added_at: new Date(),
  });
};

module.exports.enqueueSpotifyToDeezerReplication = async (playlistId) => {
  await connect();
  return db.collection('jobs').insertOne({
    type: 'replicate_spotify_to_deezer',
    playlistId,
    status: jobStatus.TO_SCRAPE,
    added_at: new Date(),
  });
};

module.exports.addPlaylistInfo = async (playlist) => {
  await connect();
  return db.collection('playlists').updateOne({
    id: playlist.id,
  }, {
    $set: {
      ...playlist
    },
  }, {
    upsert: true,
  });
};

module.exports.updateJobStatus = async (id, status) => {
  await connect();
  return db.collection('jobs').updateOne({
    _id: id,
  }, {
    $set: {
      status,
    }
  });
};

module.exports.getJob = async (criteria) => {
  await connect();
  return new Promise(async (res, rej) => {
    db.collection('jobs').findOne(criteria, (err, data) => {
      if (err) return rej(err);
      res(data);
    });
  });
};

module.exports.getPlaylist = async (playlistId) => {
  await connect();
  return new Promise((res, rej) =>
    db.collection('playlists').findOne({ id: playlistId }, (err, data) => {
      if (err) return rej(err);
      return res(data);
    }));
};

module.exports.getPlaylists = async () => {
  await connect();
  return db.collection('playlists')
    .find({}, {
      projection: {
        id: true,
        name: true,
        description: true,
        owner: true,
        updated: true,
        created: true,
        cover: true,
        tags: true,
        tracks: true,
      }
    })
    .sort({ created: -1 })
    .toArray();
};

module.exports.getJobs = async () => {
  await connect();
  return db.collection('jobs')
    .find({ status: jobStatus.TO_SCRAPE });
  // .sort({ added_at: -1 })
};

module.exports.addPlaylistReplicationData = async (data) => {
  await connect();
  return db.collection('playlists').updateOne({
    id: data.id,
  }, {
    $set: {
      ...playlist
    },
    $addToSet: {
      tags: playlist.tag,
    },
  }, {
    upsert: true,
  });
};
