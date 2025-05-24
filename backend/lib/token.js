const jwt = require("jsonwebtoken");

exports.generateToken = async (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      maxAge: 24 * 7 * 60 * 60 * 1000,
      path: "/",
      httpOnly: true,
    });
    return token;
  } catch (error) {
    console.log(error);
  }
};
