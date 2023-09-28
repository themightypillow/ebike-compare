const express = require('express');
const app = express();

const database = require('./controllers/databaseController');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { bikes: database.getBikes() });
});

app.get('/filter', (req, res) => {
  const conditions = parseQuery(req.query);
  res.send(database.getBikes(conditions));
});

function parseQuery(query) {
  let sql_query = [];
  Object.keys(query).forEach(group => {
    if(Array.isArray(query[group])) {
      const orStatement = query[group].map(val => `${group} = '${val}'`).join(' OR ');
      sql_query.push(`(${orStatement})`);
    }
    else {
      sql_query.push(`${group} = '${query[group]}'`);
    }
  });
  return sql_query.join(' AND ');
}

app.listen(3000);