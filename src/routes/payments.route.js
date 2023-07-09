const express = require("express");
const PaymentController = require("../controller/payment.controller");
const { verify } = require("../middleware/authenticateToken");
const router = express.Router();

router.post(
  "/generate-qr-hash",
  verify,
  PaymentController.generateQRController
);

router.get("/scan-qr/:hash", PaymentController.scanQRController);

router.post("/initiate/:transaction_id", PaymentController.initiateTransaction);
// router.post("/qr-payment", AuthenticationController.signUpController);

module.exports = router;
