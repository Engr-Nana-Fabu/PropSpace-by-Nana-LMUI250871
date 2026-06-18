const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  create,
  getAll,
  getById,
  myListings,
  update,
  remove
} = require(
  "../controllers/propertyController"
);

router.get("/", getAll);

router.get(
  "/my-listings",
  authMiddleware,
  myListings
);

router.get(
  "/:id",
  getById
);

router.post(
  "/",
  authMiddleware,
  create
);

router.put(
  "/:id",
  authMiddleware,
  update
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;