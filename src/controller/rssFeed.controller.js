// const catchAsync = require('../utils/catchAsync');
const catchAsync = require("../utils/catchAsync");
const { RssService } = require("../services");
const { successResponse, redirect } = require("../utils/responder");

class RssController {
  static getFeeds = catchAsync(async (req, res, next) => {
    const feeds = await RssService.getFeeds();
    return successResponse(req, res, feeds);
  });
}

module.exports = RssController;
