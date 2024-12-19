const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Registration API
const registerUser = async (req, res) => {
  const { firstName, lastName, NIDNumber, phoneNumber, password, bloodGroup } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({
      firstName,
      lastName,
      NIDNumber,
      phoneNumber,
      password: hashedPassword,
      bloodGroup,
    });
    await user.save();
    res.status(201).json({ message: "User Registered Successfully!" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login API
const loginUser = async (req, res) => {
  const { phoneNumber, password } = req.body;

  const user = await User.findOne({ phoneNumber });
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.json({ message: "Login Successful", token });
  } else {
    res.status(401).json({ message: "Invalid Credentials" });
  }
};

// Single Profile Read
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

// All Users API
const getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Update User API
const updateUserProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "User Updated Successfully", user });
};

// Delete User API
const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User Deleted Successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  deleteUser,
};
