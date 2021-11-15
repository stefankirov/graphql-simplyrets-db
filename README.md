# Submission

Hi There!

I've submitted the following folders/files:

components -> simplyRETS.js - this is where I keep the third party API calls and connections
middleware -> auth.js - the simple authentication middleware to get user by token. Ofcourse, this is for testing purposes and ideally we'd like to use JWT at minimum and a secret. 
models - the Mongoose models. Decided to use Mongoose so we have consistent data models. 
schema -> resolvers.js - the Apollo resolvers, the business logic and all resolvers are here in one file since the task is small

- AddFavoriteListing - for each request to this endpoint/resolver we upsert {listingId, count} to MongoDB (increment count if listingId exists). 

- GetListings - Here we call the SimplyRETS API for /properties. Then we merge the results with the "favoriteCount" from Mongo. I decided to get all the Mongo counts at once, calling mongo with the array of "listings" that I got from the SimplyRETS response. This way I limit my mongoDB calls to only 1, and do the merging with a couple of loops on the server side. 

types - the provided types schema, added here FavoriteListing, the Query and the Mutation. 

tests - any jest testing modules. 

index.js - the index file, basic server setup with Express and Apollo, waiting for Mongo connection before startup and added the token parsing in the context. 


# Getting started

With Node LTS (>14) installed, run the following commands in order:

```sh
yarn install
yarn start:db
yarn start:app
```  

Navigate to `http://localhost:4000/graphql`.

## Once the server is running, you can try the following query & mutation. 

I changed the original query from ```properties``` -> ```listings```
Added address fields in the query

```
query {
  listings(city: "San Francisco") {
    listingId
    favoriteCount // coming from MongoDB, everything else comes from SimplyRETS
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
```

The Mutation to update favorite count is:
```
mutation Mutation($listingId: String!) {
  addFavoriteListing(listingId: $listingId) {
    listingId
    count
  }
}
```

## Testing

To test run:
```yarn test
```

Testing is basic and only using mocked Apollo Server and resolvers. 

# Submission

Once you are satisfied with your assignment, please publish your code (ignore the `node_modules` folder) to a Git repository and send the repository link to `eng.assignment@sideinc.com`.  




