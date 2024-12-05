const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    username: String!
    role: String!
    token: String!
  }

  type Mutation {
    login(username: String!, password: String!): User
    register(username: String!, password: String!, role: String!): User
  }
`;
