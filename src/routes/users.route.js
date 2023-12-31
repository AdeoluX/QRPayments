const express = require("express");
const CustomerController = require("../controller/customer.controller");
const { verify } = require("../middleware/authenticateToken");
const router = express.Router();

router.get("/", verify, CustomerController.getCustomerController);
router.get(
  "/accountDetails",
  verify,
  CustomerController.getAccountDetailsController
);
// router.get(
//   "/transactions",
//   verify,
//   CustomerController.getTransactionsController
// );
router.post("/create-store", verify, CustomerController.createStoreController);
router.get("/get-store", verify, CustomerController.getStoreController);
router.post(
  "/upload-store-item/:store_id",
  verify,
  CustomerController.uploadStoreItem
);

router.post("/fund-wallet", verify, CustomerController.fundWallet);
router.get("/transactions", verify, CustomerController.getTransactions)

router.post("/set-pin", verify, CustomerController.setTransactionPin)

router.post("/set-limit", verify, CustomerController.setTransferLimits)


module.exports = router;
