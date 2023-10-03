const sqlite = require('better-sqlite3');
const path = require('path');

function getBike(id) {
  const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true}); 
  const bike = db.prepare('SELECT * FROM models WHERE id = ?').get(id);
  db.close();
  return bike;
}

function getBikes(data) {
  const query = parseData(data);
  const db = new sqlite(path.resolve(__dirname, '..', 'database', 'ebikes.db'), { fileMustExist: true, readonly: true}); 
  const bikes = db.prepare(query).all();
  db.close();
  return bikes;
}

function parseData(data) {
  let query = ['SELECT id, name, brand, price, category FROM models'];
  if(!isEmpty(data)) {
    if(data.sort) {
      query[2] = ` ORDER BY ${setSort(data.sort)}`;
      delete data.sort;
    }
    if(!isEmpty(data)) {
      query[1] = ` WHERE ${parseSearchConditions(data)}`;
    }
  }
  return query.join("");
}

function parseSearchConditions(data) {
  let sql_query = [];
  Object.keys(data).forEach(group => {
    if(Array.isArray(data[group])) {
      const orStatement = data[group].map(val => makeColumnQuery(group, val)).join(' OR ');
      sql_query.push(`(${orStatement})`);
    }
    else {
      sql_query.push(makeColumnQuery(group, data[group]));
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

function setSort(str) {
  switch(str){
    case 'brand-az':
      return 'brand ASC, name ASC'
    case 'price-low':
      return 'price ASC'
    case 'price-high':
      return 'price DESC'
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