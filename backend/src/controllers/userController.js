const {
  getProfile,
  updateProfile,
  changePassword
} = require(
  "../services/userService"
);

const profile = async (
  req,
  res
) => {

  try {

    const user =
      await getProfile(
        req.user.userId
      );

    res.status(200).json(
      user
    );

  } catch (error) {

    res.status(404).json({
      message: error.message
    });
  }
};

const update = async (
  req,
  res
) => {

  try {

    const user =
      await updateProfile(
        req.user.userId,
        req.body
      );

    res.status(200).json(
      user
    );

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
};

const updatePassword =
  async (req, res) => {

    try {

      const result =
        await changePassword(
          req.user.userId,
          req.body.oldPassword,
          req.body.newPassword
        );

      res.status(200).json(
        result
      );

    } catch (error) {

      res.status(400).json({
        message:
          error.message
      });
    }
  };

module.exports = {
  profile,
  update,
  updatePassword
};