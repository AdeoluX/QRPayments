const authRoute = require("./authentication.route");
const customerRoute = require("./users.route");
const storeRoute = require("./stores.route");
const paymentRoute = require("./payments.route");
const verificationRoute = require("./verification.route");
const rssFeedRoute = require("./rssFeed.router")

module.exports = {
  authRoute,
  customerRoute,
  storeRoute,
  paymentRoute,
  verificationRoute,
  rssFeedRoute
};
