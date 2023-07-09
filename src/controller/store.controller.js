// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { StoreService } = require("../services");
const { successResponse } = require("../utils/responder");

class StoreController {
  static getOneStoreController = catchAsync(async (req, res, next) => {
    const login = await StoreService.getOneStore({ store_id: req.params.id });
    return successResponse(req, res, login);
  });

  static getAllStoreController = catchAsync(async (req, res, next) => {
    const login = await StoreService.getAllStore({ ...req.body });
    return successResponse(req, res, login);
  });

  static itemSearchController = catchAsync(async (req, res, next) => {
    const customer = await StoreService.searchStoresByItems(req.query);
    return successResponse(req, res, customer);
  });
}

module.exports = StoreController;
