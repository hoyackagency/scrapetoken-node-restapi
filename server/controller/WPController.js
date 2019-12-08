const axios = require('axios');
const config = require('../../config/config');
// const qs = require('querystring');


// Get User(Me) Information from the WordPress REST API
exports.getUserMe = (req, res) => {
  if (req.headers.authorization === undefined) {
    return res.status(400).send({
      message: 'Bad request'
    });
  }

  axios({
    method: 'post',
    url: config.base_url + 'wp-json/wp/v2/users/me',
    headers: {
      Authorization: req.headers.authorization
    }
  })
  .then(response => {
    return res.status(200).send(response.data);
  })
  .catch(error => {
    if (error.response) {
      return res.status(403).send(error.response.data);
    } else if (error.request) {
      return res.status(403).send(error.request.data);
    } else {
      return res.status(403).send(error.message);
    }
  });
};


// Get My Information (Promise)
exports.getMyInfo = (req, res) => {
  return new Promise((resolve, reject) => {
    if (req.headers.authorization === undefined) {
        resolve(null);
    }

    axios({
      method: 'post',
      url: config.base_url + 'wp-json/wp/v2/users/me',
      headers: {
        Authorization: req.headers.authorization
      }
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(error => {
      reject(null);
    });
  });
};