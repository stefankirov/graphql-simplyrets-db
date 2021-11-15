const { ForbiddenError } = require("apollo-server-express");
const FavoriteListing = require("../models/favorite-listing");
const simplyRETS = require("../components/simplyrets");
const DEFAULT_TIMEOUT = 10000;

/**
 * initializing the simplyRETS API only once here.
 * The secrets here should come from NODE_ENV and/or secure key vault.
 * Added default timeout for any external dependencies 10s
 */
const simplyRETSClient = new simplyRETS(
  "simplyrets",
  "simplyrets",
  "https://api.simplyrets.com/",
  DEFAULT_TIMEOUT
);

/** This can be used if we want to pull favorite Listing count from Mongo per one Listing at a time
 * @param String listingId
 * @returns FavoriteListing
 */
const favoriteListingCount = async (listingId) => {
  return await FavoriteListing.findOne({ listingId: listingId });
};

/**
 *
 * @param Array listingIds
 * @returns FavoriteListings
 */
const favoriteListings = async (listingIds) => {
  return await FavoriteListing.find({ listingId: { $in: listingIds } });
};

module.exports = {
  Query: {
    /**
     * Optional param  - args.city: String
     * @returns Listings
     */
    listings: async (parent, args, context) => {
      if (!context.user) throw new ForbiddenError(error.auth.failed);
      const result = await simplyRETSClient.properties(args.city);

      //Chose here to call mongoDB only once and have a nested forLoop.
      //This way I only get the data from Mongo that is needed to merge into the Listings result from simplyRETS API
      let listingIds = result.map((listing) => listing.listingId);
      const favoriteListingsResult = await favoriteListings(listingIds);

      favoriteListingsResult.forEach((item) => {
        result.forEach((listing) => {
          if (item._doc.listingId === listing.listingId) {
            listing.favoriteCount = item._doc.count;
          }
        });
      });

      return result;
    },
  },
  Mutation: {
    //Incrementing counter here if record exists, else add new record to mongo
    addFavoriteListing: async (parent, args, context) => {
      if (!context.user) throw new ForbiddenError(error.auth.failed);
      const query = { listingId: args.listingId };
      const result = await FavoriteListing.findOneAndUpdate(
        query,
        { $inc: { count: 1 } },
        { upsert: true, new: true }
      );
      return result;
    },
  },
};