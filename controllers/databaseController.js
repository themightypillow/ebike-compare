const sqlite = require('better-sqlite3');
const path = require('path');

function getBike(id) {
  const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true}); 
  const bike = db.prepare('SELECT * FROM models WHERE id = ?').get(id);
  db.close();
  return bike;
}

function getBikes(conditions) {
  let query = 'SELECT id, name, brand, price, category FROM models';
  if(conditions) query += ` WHERE ${conditions}`;
  const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true}); 
  const bikes = db.prepare(query).all();
  db.close();
  return bikes;
}

module.exports = { getBike, getBikes };