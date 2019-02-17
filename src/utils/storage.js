const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const dbName = '9tracks';

const linkStatus = module.exports.linkStatus = {
  TO_SCRAPE: 0,
  SCRAPING: 1,
  SCRAPED: 2,
};

const execute = async (func) => {
  const client = new MongoClient(url);
  await client.connect();
  const db = client.db(dbName);
  return func(db, () => client.close());
};

module.exports.addLinkToScrape = async (playlistId, source) => {
  return execute(async (db, done) => {
    await db.collection('links').updateOne({
      playlistId,
    }, {
      $set: {
        url,
        status: linkStatus.TO_SCRAPE,
        updated_at: new Date(),
      },
      $addToSet: {
        source
      }
    }, {
      upsert: true,
    });
    done();
  });
};

module.exports.addPlaylistInfo = async (playlist) => {
  return execute(async (db, done) => {
    await db.collection('playlists').updateOne({
      id: playlist.id,
    }, {
      $set: {
        ...playlist
      }
    }, {
      upsert: true,
    });
    done();
  });
};

module.exports.getLinksToScrape = () => {
  return execute(async (db, done) => {
    const records = await db.collection('links').find({
      status: linkStatus.TO_SCRAPE,
    }).toArray();
    done();
    return records;
  });
};

module.exports.updateLinkStatus = async (playlistId, status) => {
  return execute(async (db, done) => {
    await db.collection('links').updateOne({
      playlistId,
    }, {
      $set: {
        status,
      }
    });
    done();
  });
};


module.exports.getLink = (playlistId) => {
  return execute(async (db, done) => {
    const records = await db.collection('links').find({ playlistId }).limit(1).toArray();
    done();
    return records[0];
  });
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
    const records = await db.collection('playlists').find({}).toArray();
    done();
    return records;
  });
};
