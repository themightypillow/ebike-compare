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
  res.send(database.getBikes(req.query));
});

app.listen(3000);