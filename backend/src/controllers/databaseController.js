const sqlite = require('better-sqlite3');
const path = require('path');

const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true});
const stmt = db.prepare('SELECT * FROM models WHERE name = ?');

const getBike = (name) => {
  return stmt.all(name);
};

module.exports = { getBike };