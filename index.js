const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const typeDefs = require("./types/index");
const resolvers = require("./schema/resolvers");
const auth = require("./middleware/auth");

// Please use apollo server to implement your graphql query
const startServer = async () => {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = await auth.getUser(token);
      return { user };
    },
  });
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });

  await mongoose.connect("mongodb://localhost:27017/properties", {
    useNewUrlParser: true,
  });

  app.listen({ port: 4000 }, () =>
    console.log(`Listening on http://localhost:4000/graphql`)
  );
};

startServer();
