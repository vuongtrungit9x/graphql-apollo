module.exports = (serviceContext) => {
  const resolvers = {
    Query: require('./Query')(serviceContext),
    Mutation: require('./Mutation')(serviceContext),
    User: require('./User')(serviceContext),
    Folder: require('./Folder')(serviceContext),
  }

  return resolvers;
}