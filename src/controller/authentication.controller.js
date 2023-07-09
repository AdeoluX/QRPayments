// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { AuthenticationService } = require("../services");
const { successResponse } = require("../utils/responder");

class AuthenticationController {
  static loginController = catchAsync(async (req, res, next) => {
    const login = await AuthenticationService.login({ ...req.body });
    return successResponse(req, res, login);
  });

  static signUpController = catchAsync(async (req, res, next) => {
    const customer = await AuthenticationService.signUp(req.body);
    return successResponse(req, res, customer);
  });
}

module.exports = AuthenticationController;
