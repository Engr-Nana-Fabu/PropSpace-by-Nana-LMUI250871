const Property = require("../models/Property");

const createProperty = async (data) => {
  return await Property.create(data);
};

const getAllProperties = async (filter = {}) => {
  return await Property
    .find(filter)
    .populate(
      "owner",
      "username email"
    );
};

const getPropertyById = async (id) => {
  return await Property
    .findById(id)
    .populate(
      "owner",
      "username email"
    );
};

const getPropertiesByOwner = async (
  ownerId
) => {
  return await Property.find({
    owner: ownerId
  });
};

const updateProperty = async (
  id,
  data
) => {
  return await Property.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

const deleteProperty = async (id) => {
  return await Property.findByIdAndDelete(
    id
  );
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  getPropertiesByOwner,
  updateProperty,
  deleteProperty
};