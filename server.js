const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const fs = require('fs');
const utils = require('./utils');

const GRAPHQL_PORT = 3000;
const graphQLServer = express();
const config = utils.loadConfigFromFile();
const dbConnections = require('./initdb')(config);

const serviceContext = {
  config,
  dbConnections
};

serviceContext.dal = require('./dal')(serviceContext);

const resolvers = require('./resolvers')(serviceContext);
const typeDefs = fs.readFileSync('./schema.graphql', 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });


graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
graphQLServer.listen(GRAPHQL_PORT, () => {
  console.log(`GraphiQL is now running on http://localhost:${GRAPHQL_PORT}/graphiql`);
});