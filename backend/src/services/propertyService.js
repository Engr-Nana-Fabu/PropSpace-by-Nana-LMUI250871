const {
  createProperty,
  getAllProperties,
  getPropertyById,
  getPropertiesByOwner,
  updateProperty,
  deleteProperty
} = require(
  "../repositories/propertyRepository"
);

const createListing = async (
  propertyData,
  ownerId
) => {

  if (
    !propertyData.title ||
    !propertyData.description ||
    !propertyData.price ||
    !propertyData.city ||
    !propertyData.country ||
    !propertyData.propertyType
  ) {
    throw new Error(
      "Missing required property fields"
    );
  }

  return await createProperty({
    ...propertyData,
    owner: ownerId
  });
};

const getListings = async (
  city,
  minPrice,
  maxPrice
) => {

  const filter = {};

  if (city) {
    filter.city = city;
  }

  if (minPrice || maxPrice) {

    filter.price = {};

    if (minPrice) {
      filter.price.$gte =
        Number(minPrice);
    }

    if (maxPrice) {
      filter.price.$lte =
        Number(maxPrice);
    }
  }

  return await getAllProperties(
    filter
  );
};

const getPropertyByIdService = async (
  propertyId
) => {

  const property =
    await getPropertyById(
      propertyId
    );

  if (!property) {
    throw new Error(
      "Property not found"
    );
  }

  return property;
};

const getMyListings = async (
  userId
) => {

  return await getPropertiesByOwner(
    userId
  );
};

const updateListing = async (
  propertyId,
  userId,
  updateData
) => {

  const property =
    await getPropertyById(
      propertyId
    );

  if (!property) {
    throw new Error(
      "Property not found"
    );
  }

  if (
    property.owner._id.toString() !==
    userId
  ) {
    throw new Error(
      "Forbidden"
    );
  }

  return await updateProperty(
    propertyId,
    updateData
  );
};

const removeListing = async (
  propertyId,
  userId
) => {

  const property =
    await getPropertyById(
      propertyId
    );

  if (!property) {
    throw new Error(
      "Property not found"
    );
  }

  if (
    property.owner._id.toString() !==
    userId
  ) {
    throw new Error(
      "Forbidden"
    );
  }

  await deleteProperty(
    propertyId
  );

  return {
    message:
      "Property deleted successfully"
  };
};

module.exports = {
  createListing,
  getListings,
  getMyListings,
  getPropertyByIdService,
  updateListing,
  removeListing
};