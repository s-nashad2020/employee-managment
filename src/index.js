const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const employeeSchema = require("./schemas/employeeSchema");
const authSchema = require("./schemas/authSchema");
const employeeResolvers = require("./resolvers/employeeResolvers");
const authResolvers = require("./resolvers/authResolvers");
const authMiddleware = require("./utils/auth");

const MONGO_URI = "mongodb://127.0.0.1:27017/employee-management";

// Combine schemas and resolvers
const typeDefs = [employeeSchema, authSchema];
const resolvers = [employeeResolvers, authResolvers];

// Start server
async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      console.log("Request headers:", req.headers); // Log the headers for every request
      console.log("Operation name:", req.body?.operationName); // Log the operation name for every request

      // Check if the operation is login, register, or introspection (skip authentication for these)
      const isNoAuthRequired =
        req.body?.operationName === "IntrospectionQuery" ||
        req.body?.operationName === "login" ||
        req.body?.operationName === "register";

      if (isNoAuthRequired) {
        console.log("No authentication required for this operation.");
        return { req }; // Skip authentication for login/register/introspection
      }

      console.log("Authentication required, applying middleware...");
      const user = authMiddleware({ req });
      return { req, user }; // Return the user object if authentication is successful
    },
    introspection: process.env.NODE_ENV === "production" ? false : true, // Disable introspection in production
    playground: process.env.NODE_ENV === "production" ? false : true, // Disable playground in production
    debug: true,
  });

  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("🚀 Connected to MongoDB");

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer();
