const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
require("./db/conn");
require("dotenv").config();
app.use(cookieParser());

app.use(express.json());

// Link to router file to make code easy middle ware
app.use(require("./router/auth"), (req, res, next) => {
  console.log("router Middelware");
  next();
});

// routes

// app.get("/about", (req, res) => {
//   res.send("Hello World in about");
// });

app.get("/contact", (req, res) => {
  res.send("Hello World in contact");
});

app.get("/signin", (req, res) => {
  res.send("Hello World in signin");
});

app.get("/signup", (req, res) => {
  res.send("Hello World in signup");
});

PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Port is listening on ${PORT}`);
});
