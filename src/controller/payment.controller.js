// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { PaymentService } = require("../services");
const { successResponse } = require("../utils/responder");

class PaymentController {
  static generateQRController = catchAsync(async (req, res, next) => {
    const qrHash = await PaymentService.generateQRHash({
      auth: req.auth,
      ...req.body,
    });
    return successResponse(req, res, qrHash);
  });

  static scanQRController = catchAsync(async (req, res, next) => {
    const customer = await PaymentService.scanQR(req.params.hash);
    return successResponse(req, res, customer);
  });

  static initiateTransaction = catchAsync(async (req, res, next) => {
    const customer = await PaymentService.initiateTransaction({
      auth: req.auth,
      reference: req.params.transaction_id,
    });
    return successResponse(req, res, customer);
  });
}

module.exports = PaymentController;
