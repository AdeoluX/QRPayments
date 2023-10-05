const express = require("express");
const VerificationController = require("../controller/verification.controller");
const { verify } = require("../middleware/authenticateToken");
const router = express.Router();

router.post("/nuban", verify, VerificationController.verifyNuban);

module.exports = router;
