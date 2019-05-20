const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Query {
    user(id: String): User
    users: [User]
    getFortuneCookie: String # we'll use this later
  }
  type User {
    id: String
    firstName: String
    lastName: String
    folders: [Folder]
  }
  type Folder {
    id: String
    name: String
    description: String
    user: User
  }
`;
const schema = makeExecutableSchema({ typeDefs, resolvers });

module.exports = schema;