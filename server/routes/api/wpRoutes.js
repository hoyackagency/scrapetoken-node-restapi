const WPController = require('../../controller/WPController');

module.exports = (app) => {
  app.get('/api/users/me', (req, res) => {
    WPController.getUserMe(req, res);
  });
};
