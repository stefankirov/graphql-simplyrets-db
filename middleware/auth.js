const User = require("../models/user");
const { AuthenticationError } = require("apollo-server-express");

/**
 * @param {*} token 
 * @returns User emal
 */
module.exports.getUser = async (token) => {
  const query = { token: token };
  const result = await User.findOne(query);
  if (!result) {
    throw new Error(AuthenticationError);
  }
  return result.email;
};
