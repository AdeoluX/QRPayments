const express = require("express");
const AuthenticationController = require("../controller/authentication.controller");
const router = express.Router();

router.post("/login", AuthenticationController.loginController);
router.post("/signup", AuthenticationController.signUpController);

module.exports = router;
