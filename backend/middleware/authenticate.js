const JWT = require("jsonwebtoken");
const User = require("../model/userSchema");

const authenticate = async (req, res, next) => {
  try {
    console.log("Test starting");

    const token = req.cookies.jwtoken;
    console.log("Test working");
    const verifyToken = JWT.verify(token, process.env.SECRET_KEY);

    const rootUser = await User.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) {
      throw new Error("User Not Found");
    }
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();
  } catch (err) {
    console.log("Test error");
    res.status(401).send("Unautherized");
    console.log(err);
  }
};

module.exports = authenticate;
