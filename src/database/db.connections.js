// var mongoose = require('mongoose');
const mongoose = require("mongoose");

const mongo = mongoose
  .connect(
    `mongodb+srv://d1headphones:${process.env.DB_PASSWORD}@cluster0.32zlgb8.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((con) => console.log("DB connected Dont lose focus!"));

const conn = mongoose.connection;

conn.on("error", () => console.error.bind(console, "connection error"));

conn.once("open", () => console.info("Connection to Database is successful"));

module.exports = { mongo, conn };
