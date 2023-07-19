// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { PaymentService } = require("../services");
const { successResponse, redirect } = require("../utils/responder");

class PaymentController {
  static generateQRController = catchAsync(async (req, res, next) => {
    const qrHash = await PaymentService.generateQRHash({
      auth: req.auth,
      ...req.body,
    });
    return successResponse(req, res, qrHash);
  });

  static scanQRController = catchAsync(async (req, res, next) => {
    const customer = await PaymentService.scanQR(req.params.hash, req.auth);
    return successResponse(req, res, customer);
  });

  static initiateTransaction = catchAsync(async (req, res, next) => {
    const customer = await PaymentService.initiateTransaction({
      auth: req.auth,
      qr_hash: req.params.transaction_id,
    });
    return successResponse(req, res, customer);
  });

  static initiatePayment = catchAsync(async (req, res, next) => {
    const customer = await PaymentService.initiate({
      auth: req.auth,
      payload: req.body,
      action: req.query.action,
    });
    return successResponse(req, res, customer);
  });

  static callbackController = catchAsync(async (req, res, next) => {
    const customer = await PaymentService.processCallback({
      query: req.query,
    });
    return redirect(res, 'https://qrpayments-production.up.railway.app/api/v1/pay/redirectUrl')
  });

  static redirectUrlController = catchAsync(async (req, res, next) => {
    return successResponse(req, res, {success: true});
  });
}

module.exports = PaymentController;
