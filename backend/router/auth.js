const express = require("express");
const router = express.Router();
require("../db/conn");
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body; //Object Destructuring

  //   Validation
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).json({ error: "Plz fill all the fields" });
  }

  ////   DB check and save
  //   -----------=====================------------------`
  ////   Using Promises-----------------------

  //   User.findOne({ email })
  //     .then((userExist) => {
  //       if (userExist) {
  //         return res.status(422).json({ error: "User already exists" });
  //       }

  //       const user = new User({ name, email, phone, work, password, cpassword });
  //       user
  //         .save()
  //         .then(() =>
  //           res.status(201).json({ Message: "User registered successfully" })
  //         )
  //         .catch((err) =>
  //           res.status(500).json({ error: "Failed to register user" })
  //         );
  //     })
  //     .catch((err) => console.log(err));

  // Using async function

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(422).json({ error: "User already exists" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "Password not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      // Hashing Middleware

      const userRegister = await user.save();

      if (userRegister) {
        res.status(201).json({ Message: "User registered successfully" });
      } else {
        res.status(500).json({ error: "Failed to register user" });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  // destructuring
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Plz fill all the fields" });
    }

    const userLogin = await User.findOne({ email });

    if (!userLogin) {
      return res.status(400).json({ error: "invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);

    // JWT token generation

    console.log("start Generating");

    const token = await userLogin.generateAuthToken();

    console.log("Generation complete");

    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 25892000000),
      httpOnly: true,
    });

    console.log(isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "invalid credentials" });
    } else {
      res.json({ message: "User signin successfully" });
    }
  } catch (err) {
    console.error(err);
  }
});

// About us ka page
router.get("/about", authenticate, (req, res) => {
  console.log("Test start");
  res.send(req.rootUser);
  console.log("Test end");
});

router.get("/getdata", authenticate, (req, res) => {
  console.log("Test start");
  res.send(req.rootUser);
  console.log("Test end");
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("Fields are empty");
      return res.json({ error: "Plzz fill up the contact form" });
    }

    const userContact = await User.findOne({ _id: req.userID });

    if (userContact) {
      const userMessage = await userContact.addMessage(
        name,
        email,
        phone,
        message
      );

      await userContact.save();
      res.status(201).json({ message: "user Contact Successfully" });
      console.log("done contact");
    }
  } catch (err) {
    console.log(err);
  }
});

// Logout page
router.get("/logout", authenticate, (req, res) => {
  console.log("Hello from logout");
  res.clearCookie("jwtoken", { path: "/" });
  res.status(200).send("logout successfull");
});

module.exports = router;
