require('dotenv').config();
const { Pool } = require('pg');

const jobStatus = module.exports.jobStatus = {
  TO_SCRAPE: 0,
  SCRAPING: 1,
  SCRAPED: 2,
};

const pool = new Pool();

module.exports.getPlaylist = async (playlistId) => {
  return (await pool.query(
    `SELECT playlists.*, creators.name as creator 
     FROM playlists WHERE id = $1 
     JOIN creators on playlists.creator = creators.id`,
    [playlistId]
  )).rows[0];
};

module.exports.getPlaylists = async (count, offset) => {
  return (await pool.query(
    `SELECT playlists.*, creators.name as creator
     FROM playlists JOIN creators on playlists.creator = creators.id
     ORDER BY created DESC LIMIT $1 OFFSET $2`,
    [count, offset]
  )).rows;
};

module.exports.addPlaylist = async (playlist) => {
  const {
    id, name, description, updated, created, cover, totalTracks, tags, creatorId, tracks
  } = playlist;
  return pool.query(`
     INSERT INTO playlists
       (id, name, description, updated, created, cover, total_tracks, tags, creator, tracks) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (id) DO UPDATE SET
       id = $1, name = $2, description = $3, updated = $4, created = $5, cover = $6, 
       total_tracks = $7, tags = $8, creator = $9, tracks = $10, data_updated = now()
    `, [id, name, description, updated, created, cover, totalTracks, tags, creatorId, tracks]);
};

module.exports.getCreator = async (id) => {
  return (await pool.query('SELECT * FROM creators WHERE id = $1', [id])).rows[0];
};

module.exports.addCreator = (creator) => {
  const { id, name } = creator;
  return pool.query(`
     INSERT INTO creators (id, name) VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET name = $2, data_updated = now()
    `, [id, name]);
};

module.exports.getJobs = () => {
  return pool.query('SELECT * FROM jobs WHERE status = $1', [jobStatus.TO_SCRAPE]);
};

module.exports.enqueueSpotifyPlaylist = async (playlistId, source) => {
  return pool.query(`
    INSERT INTO jobs (type, target, source) VALUES ('spotify_playlist', $1, $2)
    ON CONFLICT (target) DO UPDATE SET status = 0, added = now()
  `,
    [playlistId, source]
  );
};

module.exports.enqueueRedditThread = async (threadId) => {
  return pool.query(`
    INSERT INTO jobs (type, target) VALUES ('reddit_thread', $1)
    ON CONFLICT (target) DO UPDATE SET status = 0, added = now()
  `, [threadId]);
};

module.exports.enqueueSpotifyCreator = async (userId) => {
  return pool.query(`
    INSERT INTO jobs (type, target) VALUES ('spotify_creator', $1)
    ON CONFLICT (target) DO UPDATE SET status = 0, added = now()
  `, [userId]);
};

module.exports.updateJobStatus = async (target, status) => {
  return pool.query(`UPDATE jobs SET status = $1, updated = now() WHERE target = $2`,
    [status, target]
  );
};

module.exports.getJobForTarget = async (target) => {
  return (await pool.query(`SELECT * FROM jobs WHERE target = $1`, [target])).rows[0];
};
