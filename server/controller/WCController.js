const axios = require('axios')
const qs = require('querystring');
const WooCommerceAPI = require('woocommerce-api');
const WPController = require('./WPController');
const config = require('../../config/config');


const WooCommerce = new WooCommerceAPI({
  url: config.base_url,
  consumerKey: config.consumerKey,
  consumerSecret: config.consumerSecret,
  wpAPI: true,
  version: 'wc/v1'
});


// Get Coupons
exports.getCoupons = (req, res) => {
  const code = req.query.code;
  const url = 'coupons?code=' + code;
  WooCommerce.getAsync(url).then(result => {
    res
    .status(result.statusCode)
    .json(JSON.parse(result.body));
  });
};


// Get Orders
exports.getOrders = async (req, res) => {
  WooCommerce
  .getAsync('orders')
  .then(async (result) => {

    var orders = JSON.parse(result.toJSON().body);

    const userInfo = await WPController.getMyInfo(req, res);
    if (userInfo === null) {
      return res.status(503).json({
        message: 'failed to get user information'
      });
    }

    var myOrders = orders.filter(order => order.customer_id === userInfo.id);
    if (myOrders.length > 0) {
      res
      .status(result.statusCode)
      .json(myOrders);
    } else {
      res.status(200).json("");
    }
  })
  .catch(error => {
    res.status(503).json({
      message: 'failed to get orders'
    });
  });
}


// Get Orders by ID
exports.getOrdersById = async (req, res) => {
  const id = req.params.id;
  const url = 'orders/' + id;

  WooCommerce
  .getAsync(url)
  .then(async (result) => {
    const userInfo = await WPController.getMyInfo(req, res);
    if (userInfo === null) {
      res.status(503).json({
        message: 'failed to get user information'
      });
      return;
    }

    var order = JSON.parse(result.toJSON().body);
    if (order.customer_id === userInfo.id) {
      res
      .status(result.statusCode)
      .json(order);
    } else {
      res.status(403).json({
        message: 'invalid order id'
      });
    }
  })
  .catch(error => {
    res.status(404).json({
      message: 'invalid order id'
    });
  });
};

// // Make a New Order
// exports.postOrders = (req, res) => {
//   const url = 'orders';
//   WooCommerce
//   .postAsync(url, req.body)
//   .then(result => {
//     res
//     .status(result.statusCode)
//     .json(JSON.parse(result.body));
//   });
// };

// Get Order by Customer ID
exports.getOrderByCustomerId = (req, res) => {
  const id = req.params.id;
  console.log("customer id : ", id);
  const url = 'orders?customer=' + id;
  WooCommerce
  .getAsync(url)
  .then(result => {
    res
    .status(result.statusCode)
    .json(JSON.parse(result.body));
  })
  .catch(error => {
    res.status(503).json({
      message: 'unknown error'
    });
  });
};

// // Make a Product
// exports.postProducts = (req, res) => {
//   const url = 'products';
//   WooCommerce
//   .postAsync(url, req.body)
//   .then(result => {
//     res
//     .status(result.statusCode)
//     .json(JSON.parse(result.body));
//   });
// };


// Get Customers
exports.getCustomers = (req, res) => {
  const url = 'customers';

  WooCommerce
  .getAsync(url)
  .then(result => {
    res
    .status(result.statusCode)
    .json(JSON.parse(result.body));
  })
  .catch(error => {
    res.status(503).json({
      message: 'unknown error'
    });
  });
};

// Get a Customer by ID
exports.getCustomerById = async (req, res) => {
  const id = req.params.id;
  const url = 'customers/' + id;

  WooCommerce
  .getAsync(url)
  .then(async (result) => {
    const userInfo = await WPController.getMyInfo(req, res);
    if (userInfo === null) {
      res.status(503).json({
        message: 'failed to get user information'
      });
      return;
    }

    if (Number(id) === Number(userInfo.id)) {
      res
      .status(result.statusCode)
      .json(JSON.parse(result.body));
    } else {
      res
      .status(403)
      .json({
        message: 'invalid customer id'
      });
    }
  })
  .catch(error => {
    res.status(503).json({
      message: 'failed to get customer information'
    });
  });
};

// // Create a New Customer
// exports.postCustomers = (req, res) => {
//   const url = 'customers';
//   WooCommerce
//   .postAsync(url, req.body)
//   .then(result => {
//     res
//     .status(result.statusCode)
//     .json(JSON.parse(result.body));
//   });
// };
