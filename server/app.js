const config = require('config');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const { GraphQLServer } = require('graphql-yoga');
const { typeDefs, resolvers } = require('./graphql');

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: request => {
        return request;
    }
});

// const { getUserToken } = require('./middleware');
// app.use(getUserToken);

// app.use(
//     '/graphql',
//     graphqlHTTP(request => {
//         return {
//             schema: makeExecutableSchema(typeDefs, resolvers),
//             graphiql: true
//         };
//     })
// );

// app.use('/tools', require('./routes/tools'));
// connect to db
const mongoUrl = config.mongo.url;
mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
    console.log('mongoose connected at ' + mongoUrl);
});

module.exports = server;
