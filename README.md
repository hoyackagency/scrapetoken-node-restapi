# scrapetoken-nodejs-api

This is a nodejs app to interact with Wordpress/Woocommerce based user balance operations. It uses the following technologies:
- [Express](http://expressjs.com/) for the backend api
- [Webpack](https://webpack.github.io/) for compilation

## Requirements

- [Node.js](https://nodejs.org/en/) 8+

```shell
npm install
```


## Running

Make sure to add a `config.json` file in the `config` folder. See the example there for more details.

Production mode:

```shell
npm start
```

Development (Webpack dev server) mode:

```shell
npm run start:dev
```
