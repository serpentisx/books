require('dotenv').config();

const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const api = require('./src/js/router/api');

const cookieSecret = process.env.COOKIE_SECRET || 'penguin';

const app = express();
app.use(cookieParser(cookieSecret));

app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.json());

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).json({ error: 'Not found' });
}

function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid json' });
  }

  return res.status(500).json({ error: 'Internal server error' });
}

app.use(api);

app.use(notFoundHandler);
app.use(errorHandler);

const {
  PORT: port = 3000,
  HOST: host = '127.0.0.1',
} = process.env;

app.listen(port, () => {
  console.info(`Server running at http://${host}:${port}/`);
});
