const express = require("express");
const cors = require("cors");

const authRoutes =
  require("./routes/authRoutes");

const propertyRoutes =
  require("./routes/propertyRoutes");

const userRoutes =
  require("./routes/userRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "PropSpace API Running"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/properties",
  propertyRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

module.exports = app;