const auth = require('../../controller/UserAuth');
const WCController = require('../../controller/WCController');

module.exports = (app) => {

  app.use('/api/:action', async (req, res, next) => {
    const bool = await auth.isUserAuthenticated(req, res);
    if (bool) {
      next();
    }
  });

  app.get('/api/orders/:id', (req, res) => {
    WCController.getOrdersById(req, res);
  });

  app.use('/api/orders', async (req, res, next) => {
    const bool = await auth.isUserAuthorized(req, res);
    if (bool) {
      next();
    };
  });

  app.get('/api/orders/customer/:id', (req, res) => {
    WCController.getOrderByCustomerId(req, res);
  });
  
  app.get('/api/orders', (req, res) => {
    WCController.getOrders(req, res);
  });

  app.get('/api/customers/:id', (req, res) => {
    WCController.getCustomerById(req, res);
  });

  app.get('/api/customers', (req, res) => {
    WCController.getCustomers(req, res);
  });   
  
//   app.post('/api/orders', function (req, res) {
//     WCController.postOrders(req, res);
//   });

//   app.post('/api/products', function (req, res) {
//     WCController.postProducts(req, res);
//   });

//   app.post('/api/customers', function (req, res) {
//     WCController.postCustomers(req, res);
//   });

  // app.get('/api/customers/:id', function (req, res) {
  //   WCController.getCustomerById(req, res);
  // });
};
