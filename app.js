require("dotenv").config();
const express = require("express");
const app = express();

const ApiError = require("./src/utils/ApiError");
const httpStatus = require("http-status");

const cors = require("cors");

const db = require("./src/database/db.connections");

const {
  authRoute,
  customerRoute,
  storeRoute,
  paymentRoute,
  verificationRoute,
  rssFeedRoute
} = require("./src/routes");

const { errorConverter, errorHandler } = require("./src/middleware/error");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use this after the variable declaration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/customer", customerRoute);
app.use("/api/v1/stores", storeRoute);
app.use("/api/v1/pay", paymentRoute);
app.use("/api/v1/verification", verificationRoute);
app.use("/api/v1/rssFeed", rssFeedRoute)

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
