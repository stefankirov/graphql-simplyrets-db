const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("../types/index");
//const resolvers = require("../schema/resolvers");

//hardcoded test resolver
const resolvers = {
  Mutation: {
    addFavoriteListing: (parent, args, context) => {
      return {
        listingId: args.listingId,
        count: 1,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  mockEntireSchema: false,
  context: () => ({ user: { email: "test@test.com" } }),
});

const ADD_FAVORITE_LISTING = gql`
  mutation AddFavoriteListing($listingId: String!) {
    addFavoriteListing(listingId: $listingId) {
      listingId
      count
    }
  }
`;

/**
 * Testing adding a favorite listing
 */
describe("Test Add Favorite Listing", () => {
  it("it should return the added listing id and count", async () => {
    const result = await server.executeOperation({
      query: ADD_FAVORITE_LISTING,
      variables: { listingId: "83502118" },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data.addFavoriteListing.listingId).toBe("83502118");
    expect(result.data.addFavoriteListing.count).toBe(1);
  });

  /**
   * Testing same resolver with bad input
   */
  it("it should throw an error if no listing id is provided", async () => {
    const result = await server.executeOperation({
      query: ADD_FAVORITE_LISTING,
      variables: {},
    });

    expect(result.errors[0].name).toBe("UserInputError");
  });
});
