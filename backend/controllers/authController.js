const { generateToken } = require("../lib/token");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const cloudinary = require("../lib/cloudinary");

exports.signup = async (req, res) => {
  try {
    const { fullName, email, password, profilePic } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(404)
        .json({ success: false, message: "All Feilds Required" });
    }

    if (password.length < 6) {
      return res
        .status(404)
        .json({ success: false, message: "Password Must Be 6 Charcters Long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Email Already exists" });
    }

    // hash the passowrd

    const salt = await bcrypt.genSalt(10);

    const hashPass = await bcrypt.hash(password, salt);
    //
    const user = await User.create({
      fullName,
      email,
      password: hashPass,
      profilePic,
    });
    const token = await generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "User added SuccesFully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const verifyPass = await bcrypt.compare(password, existing.password);

    if (!verifyPass) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = await generateToken(existing.id, res);

    res.status(200).json({
      success: true,
      message: "User Login Successfully",
      existing: {
        id: existing._id,
        email: existing.email,
        fullName: existing.fullName,
        profilePic: existing.profilePic,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    res.status(200).json({ success: true, message: "User Logout Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res
        .status(404)
        .json({ success: false, message: "Profile Pic Not Found " });
    }

    //
    const uploadRes = await cloudinary.uploader.upload(profilePic);

    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRes.secure_url,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "profile update successfully",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
