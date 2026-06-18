const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  profile,
  update,
  updatePassword
} = require(
  "../controllers/userController"
);

router.get(
  "/profile",
  authMiddleware,
  profile
);

router.put(
  "/profile",
  authMiddleware,
  update
);

router.put(
  "/change-password",
  authMiddleware,
  updatePassword
);

module.exports = router;