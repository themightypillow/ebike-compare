const sqlite = require('better-sqlite3');
const path = require('path');

const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true}); 

function getBike(id) {
  return db.prepare('SELECT * FROM models WHERE id = ?').all(id);
}

function getBikesForMain() {
  return db.prepare('SELECT id, name, brand, price, category FROM models').all();
}

module.exports = { getBike, getBikesForMain };