const mongoose = require("mongoose");
require("dotenv").config();

// database
const DB = process.env.MONGO_CONNECTION_URL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
