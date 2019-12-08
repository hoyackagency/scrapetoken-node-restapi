const axios = require('axios');
const qs = require('querystring');
const config = require('../../config/config');


// Get JWT Token with username and password from the WordPress JWT REST API
exports.getToken = (req, res) => {

  // Get username and password from the request body(json format)
  const username = req.body.username;
  const password = req.body.password;

  if (username === undefined || password === undefined) {
    res.status(400).send({
      message: 'username or password is invalid'
    });
    return;
  }

  const body = {
    'username': username,
    'password': password
  }

  // Request (Post) to the WordPress JWT REST API for JWT token
  axios({
    method: 'post',
    url: config.base_url + 'wp-json/jwt-auth/v1/token',
    data: qs.stringify(body)
  })
  .then(response => {
    const token = response.data.token;
    if (token === undefined) {
      res.status(403).send(response.data);
      return false;
    }
    res.send(response.data);
  })
  .catch(error => {
    if (error.response) {
      res.status(403).send(error.response.data);
    } else if (error.request) {
      res.status(403).send(error.request.data);
    } else {
      res.status(403).send(error.message);
    }
  });
};


// Validate JWT Token using the WordPress JWT REST API for user verification
exports.tokenValidate = (req, res) => {

  // Get Token from the request header authorization
  const token = req.headers.authorization;
  if (token === undefined) {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  }

  // Request (Post) to the WordPress JWT REST API for token(user) verification
  axios({
    method: 'post',
    url: config.base_url + 'wp-json/jwt-auth/v1/token/validate',
    headers: {
      Authorization: token
    }
  })
  .then(response => {
    if (response.data.data.status == 200) {
      res.send(response.data);
    } else {
      res.status(403).send(response.data);
    }
  })
  .catch(error => {
    if (error.response) {
      res.status(403).send(error.response.data);
    } else if (error.request) {
      res.status(403).send(error.request.data);
    } else {
      res.status(403).send(error.message);
    }
  });
};


// Check if user is authenticated(that is, has a valid token)
exports.isUserAuthenticated = (req, res) => {
  return new Promise((resolve, reject) => {

    // Get Authorization Token from request header
    const authorization = req.headers.authorization;
    if (authorization == undefined) {
      res.status(400).json({
        message: "Bad request"
      });
      resolve(false);
    }

    // Request Post to WordPress JWT API for authentication
    axios({
        method: 'post',
        url: config.base_url + 'wp-json/jwt-auth/v1/token/validate',
        headers: {
          Authorization: authorization
        }
      })
      .then(response => {
        if (response.data.data.status == 200) {
          return resolve(true);
        } else {
          res.status(403).json({
            message: "User doesn't logged in"
          });
          return resolve(false);
        }
      })
      .catch(error => {
        if (error.response) {
          res.json(error.response.data);
        } else if (error.request) {
          res.json(error.request.data);
        } else {
          res.json(error.message);
        }
        reject(false);
      });
  });
};


// Check if user is authorized(that is, the token is user's)
exports.isUserAuthorized = (req, res) => {
  return new Promise((resolve, reject) => {

    // Get Authorization Token from request header
    const token = req.headers.authorization;

    // Get customer(user) id from the request(it can be get or post(json) param)
    let customer_id = '';
    if (req.method === 'GET') {
      customer_id = req.query.customer;
    } else if (req.method === 'POST') {
      customer_id = req.body.customer_id;
    }

    // Check if the parameters is valid
    if (customer_id === undefined || customer_id === '') {
      res.status(400).json({
        message: 'Bad request'
      });
      resolve(false);
    }

    // Request (Post) to the WordPress REST API to get token's owner
    axios({
        method: 'post',
        url: config.base_url + 'wp-json/wp/v2/users/me',
        headers: {
          Authorization: token
        }
      })
      .then(response => {
        if (response.data.id !== undefined) {
          const userId = response.data.id;
          if (Number(userId) !== Number(customer_id)) {
            res.status(403).json({
              message: 'authorization error'
            });
            resolve(false);
          }
          resolve(true);
        } else {
          res.status(403).send(response.data);
          resolve(false);
        }
      })
      .catch(error => {
        if (error.response) {
          res.status(403).send(error.response.data);
        } else if (error.request) {
          res.status(403).send(error.request.data);
        } else {
          res.status(403).send(error.message);
        }
        reject(false);
      });
  });
};
