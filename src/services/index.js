const AuthenticationService = require("./authentication.service");
const CustomerService = require("./customer.service");
const StoreService = require("./store.service");
const PaymentService = require("./payment.service");
const VerificationService = require("./verification.service");
const RssService = require("./rssFeed.service")

module.exports = {
  AuthenticationService,
  CustomerService,
  StoreService,
  PaymentService,
  VerificationService,
  RssService
};
