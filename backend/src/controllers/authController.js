const {
  registerUser,
  loginUser
} = require("../services/authService");

const register = async (req, res) => {

  try {

    const user =
      await registerUser(req.body);

    res.status(201).json({
      message: "User registered successfully",
      user
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
};

const login = async (req, res) => {

  try {

    const result =
      await loginUser(
        req.body.email,
        req.body.password
      );

    res.status(200).json(result);

  } catch (error) {

    res.status(401).json({
      message: error.message
    });
  }
};

module.exports = {
  register,
  login
};