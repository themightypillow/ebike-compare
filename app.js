const express = require('express');
const app = express();

const database = require('./controllers/databaseController');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { bikes: database.getBikesForMain() });
});

app.listen(3000);