const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail
} = require("../repositories/userRepository");

const registerUser = async (userData) => {

  if (
    !userData.username ||
    !userData.email ||
    !userData.password
  ) {
    throw new Error(
      "All fields are required"
    );
  }

  const existingUser =
    await findUserByEmail(
      userData.email
    );

  if (existingUser) {
    throw new Error(
      "Email already exists"
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      userData.password,
      10
    );

  const user =
    await createUser({
      username: userData.username,
      email: userData.email,
      password: hashedPassword
    });

  return {
    id: user._id,
    username: user.username,
    email: user.email
  };
};

const loginUser = async (
  email,
  password
) => {

  if (!email || !password) {
    throw new Error(
      "Email and password are required"
    );
  }

  const user =
    await findUserByEmail(email);

  if (!user) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const passwordMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!passwordMatch) {
    throw new Error(
      "Invalid email or password"
    );
  }

  const token = jwt.sign(
    {
      userId: user._id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    }
  };
};

module.exports = {
  registerUser,
  loginUser
};