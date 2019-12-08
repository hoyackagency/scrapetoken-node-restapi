const UserAuthentication = require('../../controller/UserAuth');

module.exports = (app) => {
  app.post('/api/auth/token', (req, res) => {
    UserAuthentication.getToken(req, res);
  });

  app.post('/api/auth/token/validate', (req, res) => {
    UserAuthentication.tokenValidate(req, res);
  });
};
