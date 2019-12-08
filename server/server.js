const express = require('express');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const path = require('path');
const cors = require('cors');

// const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8080;

// Configuration
// ================================================================================================

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// API routes
app.options('*', cors());
require('./routes')(app);


app.use(function (req, res) {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});


app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('>>> 🌎 Open http://0.0.0.0:%s/ in your browser.', port);
});


module.exports = app;
