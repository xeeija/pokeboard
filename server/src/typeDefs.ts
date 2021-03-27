import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    hello: String!
  }

  type Mutation {
    register(username: String!, password: String!): Boolean!
  }
`