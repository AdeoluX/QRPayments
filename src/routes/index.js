const authRoute = require("./authentication.route");
const customerRoute = require("./users.route");
const storeRoute = require("./stores.route");
const paymentRoute = require("./payments.route");
const verificationRoute = require("./verification.route");

module.exports = {
  authRoute,
  customerRoute,
  storeRoute,
  paymentRoute,
  verificationRoute,
};
