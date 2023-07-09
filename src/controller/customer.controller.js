// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { CustomerService } = require("../services");
const { successResponse } = require("../utils/responder");

class CustomerController {
  static getCustomerController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.getCustomerDetails(req.auth);
    return successResponse(req, res, customer);
  });

  static getAccountDetailsController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.getAccountDetails(req.auth);
    return successResponse(req, res, customer);
  });

  static getTransactionController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.getTransactions(req.auth);
    return successResponse(req, res, customer);
  });

  static getStoreController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.getStoreItems(req.auth);
    return successResponse(req, res, customer);
  });

  static getStoreAnalyticsController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.storeAnalytics(req.auth);
    return successResponse(req, res, customer);
  });

  static createStoreController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.createStore({
      auth: req.auth,
      body: req.body,
    });
    return successResponse(req, res, customer);
  });

  static getStoreController = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.getStore(req.auth);
    return successResponse(req, res, customer);
  });

  static uploadStoreItem = catchAsync(async (req, res, next) => {
    const customer = await CustomerService.uploadStoreItems({
      auth: req.auth,
      store_id: req.params.store_id,
      body: req.body,
    });
    return successResponse(req, res, customer);
  });
}

module.exports = CustomerController;
