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

module.exports = router;
