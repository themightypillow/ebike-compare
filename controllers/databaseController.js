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
  if(!isEmpty(conditions)) query += ` WHERE ${parseConditions(conditions)}`;
  const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true}); 
  const bikes = db.prepare(query).all();
  db.close();
  return bikes;
}

function parseConditions(query) {
  let sql_query = [];
  Object.keys(query).forEach(group => {
    if(Array.isArray(query[group])) {
      const orStatement = query[group].map(val => makeColumnQuery(group, val)).join(' OR ');
      sql_query.push(`(${orStatement})`);
    }
    else {
      sql_query.push(makeColumnQuery(group, query[group]));
    }
  });
  return sql_query.join(' AND ');
}

function makeColumnQuery(group, val) {
  switch(group) {
    case 'color':
      return `${group} LIKE '%${val}%'`;
    case 'price':
      const [min, max] = val.split(',');
      if(max === 'all') return `${group} > ${min}`;
      else return `${group} BETWEEN ${min} AND ${max}`;
    default:
      return `${group} = '${val}'`;
  }
}

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

module.exports = { getBike, getBikes };