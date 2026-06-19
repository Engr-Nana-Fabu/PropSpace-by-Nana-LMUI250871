require("dotenv").config();

const app = require("../backend/src/app");
const connectDB = require("../backend/src/config/db");

let isConnected = false;

const ensureDB = async () => {
  if (isConnected) return;
  if (process.env.MONGO_URI) {
    await connectDB();
    isConnected = true;
  }
};

module.exports = async (req, res) => {
  await ensureDB();
  return app(req, res);
};
