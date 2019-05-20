module.exports = (serviceContext) => {
  const resolvers = {
    Query: require('./Query')(serviceContext)
    // User: require('./User')(serviceContext)
  }

  return resolvers;
}