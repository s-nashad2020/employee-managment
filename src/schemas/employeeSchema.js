const { gql } = require("apollo-server");

module.exports = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int!
    class: String!
    subjects: [String]!
    attendance: Int!
  }

  input EmployeeInput {
    name: String!
    age: Int!
    class: String!
    subjects: [String]!
    attendance: Int!
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  input SortInput {
    field: String
    order: String
  }

  type Query {
    listEmployees(
      filter: EmployeeInput
      pagination: PaginationInput
      sort: SortInput
    ): [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(input: EmployeeInput!): Employee
    updateEmployee(id: ID!, input: EmployeeInput!): Employee
  }
`;
