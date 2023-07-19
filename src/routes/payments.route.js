const express = require("express");
const PaymentController = require("../controller/payment.controller");
const { verify } = require("../middleware/authenticateToken");
const router = express.Router();

router.post(
  "/generate-qr-hash",
  verify,
  PaymentController.generateQRController
);

router.post("/initiate/payments", verify, PaymentController.initiatePayment);

router.get("/scan-qr/:hash", verify, PaymentController.scanQRController);

router.post(
  "/initiateQR/:transaction_id",
  verify,
  PaymentController.initiateTransaction
);

router.get("/callback", PaymentController.callbackController);

router.get("/redirectUrl", PaymentController.redirectUrlController)

module.exports = router;
