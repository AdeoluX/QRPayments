// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { VerificationService } = require("../services");
const { successResponse } = require("../utils/responder");

class VerificationController {
  static verifyNuban = catchAsync(async (req, res, next) => {
    const { user_id } = req.auth;
    const nuban = await VerificationService.verifyNuban({
      user_id,
      data: req.body,
    });
    return successResponse(req, res, nuban);
  });
}

module.exports = VerificationController;
