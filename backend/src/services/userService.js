const bcrypt = require("bcryptjs");

const {
  findUserById,
  updateUser
} = require(
  "../repositories/userRepository"
);

const getProfile = async (userId) => {

  const user =
    await findUserById(userId);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar
  };
};

const updateProfile = async (
  userId,
  profileData
) => {

  const user =
    await updateUser(
      userId,
      {
        username:
          profileData.username,
        phone:
          profileData.phone,
        avatar:
          profileData.avatar
      }
    );

  return {
    id: user._id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar
  };
};

const changePassword = async (
  userId,
  oldPassword,
  newPassword
) => {

  const user =
    await findUserById(userId);

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const match =
    await bcrypt.compare(
      oldPassword,
      user.password
    );

  if (!match) {
    throw new Error(
      "Incorrect current password"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      newPassword,
      10
    );

  await updateUser(
    userId,
    {
      password:
        hashedPassword
    }
  );

  return {
    message:
      "Password updated successfully"
  };
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword
};