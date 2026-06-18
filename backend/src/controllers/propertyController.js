const {
  createListing,
  getListings,
  getMyListings,
  getPropertyByIdService,
  updateListing,
  removeListing
} = require(
  "../services/propertyService"
);

const create = async (
  req,
  res
) => {

  try {

    const property =
      await createListing(
        req.body,
        req.user.userId
      );

    res.status(201).json(
      property
    );

  } catch (error) {

    res.status(400).json({
      message: error.message
    });
  }
};

const getAll = async (
  req,
  res
) => {

  try {

    const properties =
      await getListings(
        req.query.city,
        req.query.minPrice,
        req.query.maxPrice
      );

    res.status(200).json(
      properties
    );

  } catch (error) {

    res.status(500).json({
      message: error.message
    });
  }
};

const myListings = async (
  req,
  res
) => {

  const properties =
    await getMyListings(
      req.user.userId
    );

  res.status(200).json(
    properties
  );
};

const update = async (
  req,
  res
) => {

  try {

    const property =
      await updateListing(
        req.params.id,
        req.user.userId,
        req.body
      );

    res.status(200).json(
      property
    );

  } catch (error) {

    if (
      error.message ===
      "Forbidden"
    ) {

      return res.status(403).json({
        message:
          "You are not allowed to edit this property"
      });
    }

    res.status(404).json({
      message: error.message
    });
  }
};

const getById = async (
  req,
  res
) => {

  try {

    const property =
      await getPropertyByIdService(
        req.params.id
      );

    res.status(200).json(
      property
    );

  } catch (error) {

    res.status(404).json({
      message: error.message
    });
  }
};

const remove = async (
  req,
  res
) => {

  try {

    await removeListing(
      req.params.id,
      req.user.userId
    );

    res.status(200).json({
      message:
        "Property deleted successfully"
    });

  } catch (error) {

    if (
      error.message ===
      "Forbidden"
    ) {

      return res.status(403).json({
        message:
          "You are not allowed to delete this property"
      });
    }

    res.status(404).json({
      message: error.message
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  myListings,
  update,
  remove
};