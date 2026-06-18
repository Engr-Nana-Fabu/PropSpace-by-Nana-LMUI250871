const User = require("../models/User");

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(
    id,
    updateData,
    { new: true }
  );
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser
};