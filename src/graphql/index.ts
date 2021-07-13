import { gql } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";

const typeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const resolvers = {
  Query: {
    _empty: () => "_empty",
  },
  Mutation: {
    _empty: () => "_empty",
  },
};

export const schemas = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
