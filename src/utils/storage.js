require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const url = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
const dbName = process.env.DB_NAME;

const execute = async (func) => {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  const db = client.db(dbName);
  return func(db, () => client.close());
};

module.exports.getPlaylist = (playlistId) => {
  return execute(async (db, done) => {
    const records = await db.collection('playlists').findOne({ id: playlistId }).toArray();
    done();
    return records;
  });
};

module.exports.getPlaylists = () => {
  return execute(async (db, done) => {
    const records = await db.collection('playlists')
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
    done();
    return records;
  });
};
