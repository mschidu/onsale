const express = require("express");
const router = express.Router();
const {
  login,
  register,
  userProfile,
} = require("../controllers/userControllers");

const { protectRoute } = require("../middleware/authMiddleware");

router.get("/api/users");
router.post("/api/login", login);
router.post("/api/register", register);
router.get("/api/userprofile", protectRoute, userProfile);

module.exports = router;
