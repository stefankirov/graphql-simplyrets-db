const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoriteListing = new Schema({
  listingId: String,
  count: Number,
});

module.exports = mongoose.model("FavoriteListing", FavoriteListing);
