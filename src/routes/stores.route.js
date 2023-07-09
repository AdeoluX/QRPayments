const express = require("express");
const StoreController = require("../controller/store.controller");
const router = express.Router();

router.get("/", StoreController.itemSearchController);
router.get("/:store_id", StoreController.getOneStoreController);

module.exports = router;
