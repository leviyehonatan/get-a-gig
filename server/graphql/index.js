const path = require('path');
const { fileLoader, mergeTypes, mergeResolvers } = require('merge-graphql-schemas');
const typeDefs = fileLoader(path.join(__dirname, './*.graphql'));
const resolvers = fileLoader(path.join(__dirname, './*.resolver.js'));
module.exports = { resolvers: mergeResolvers(resolvers), typeDefs: mergeTypes(typeDefs) };
