const { ApolloServer, gql } = require("apollo-server-express");
const typeDefs = require("../types/index");
//const resolvers = require("../schema/resolvers");

//hardcoded test resolver
const resolvers = {
  Query: {
    listings: (parent, args, context) => {
      if (args.city === "oak ridge") {
        return [
          {
            listingId: "51650230",
            favoriteCount: 3,
            listPrice: 9375751,
            property: {
              area: 5607,
              bedrooms: 3,
            },
            address: {
              streetName: "West MAJESTY STREET Path",
              city: "Oak Ridge",
              country: "United States",
              postalCode: "77379",
            },
            disclaimer:
              "This information is believed to be accurate, but without warranty.",
          },
        ];
      } else {
        return [
          {
            listingId: "51650230",
            favoriteCount: 3,
            listPrice: 9375751,
            property: {
              area: 5607,
              bedrooms: 3,
            },
            address: {
              streetName: "West MAJESTY STREET Path",
              city: "Oak Ridge",
              country: "United States",
              postalCode: "77379",
            },
            disclaimer:
              "This information is believed to be accurate, but without warranty.",
          },
          {
            listingId: "7854868",
            favoriteCount: 1,
            listPrice: 7987596,
            property: {
              area: 2305,
              bedrooms: 6,
            },
            address: {
              streetName: "East Hedstrom Road Falls",
              city: "San Francisco",
              country: "United States",
              postalCode: "77070",
            },
            disclaimer:
              "This information is believed to be accurate, but without warranty.",
          },
        ];
      }
    },
  },
};

/**
 * Using the hardcoded resolver, another option was to use the real resolver 
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
  mocks: true,
  mockEntireSchema: false,
  context: () => ({ user: { email: "test@test.com" } }),
});

const LISTING_QUERY = gql`
  query Listings($city: String) {
    listings(city: $city) {
      listingId
      favoriteCount
      listPrice
      property {
        area
        bedrooms
      }
      address {
        streetName
        city
        country
        postalCode
      }
      disclaimer
    }
  }
`;

/**
 * Testing without passing 'city' as parameter
 */
describe("Test Listings Routes", () => {
  it("it should return a list of 2 property listings", async () => {
    const result = await server.executeOperation({
      query: LISTING_QUERY,
      variables: {},
    });

    expect(result.errors).toBeUndefined();
    expect(result.data.listings.length).toBe(2);
  });

  /**
   * Testing with 'city' as parameter
   */
  it("it should return a list of one property listing with same city name", async () => {
    const result = await server.executeOperation({
      query: LISTING_QUERY,
      variables: { city: "oak ridge" },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data.listings[0].address.city).toBe("Oak Ridge");
  });
});
