const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/restaurants', require('./controllers/restaurants'));
app.use('/api/v1/reviews', require('./controllers/reviews'));

app.use(express.static(path.join(__dirname, './public/index.html')));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
