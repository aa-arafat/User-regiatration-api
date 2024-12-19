const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAllUsers,
  updateUserProfile,
  deleteUser,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.get("/all", protect, getAllUsers);
router.put("/update/:id", protect, updateUserProfile);
router.delete("/delete/:id", protect, deleteUser);

module.exports = router;
