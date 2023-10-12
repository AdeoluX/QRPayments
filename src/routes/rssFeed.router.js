const express = require("express");
const RssController = require("../controller/rssFeed.controller");
const router = express.Router();

router.get("/", RssController.getFeeds);

module.exports = router;
