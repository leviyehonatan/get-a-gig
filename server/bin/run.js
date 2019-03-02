const started = new Date();
const prettyMs = require('pretty-ms');
const app = require('../app');
const config = require('config');
let port = config.port;
let server = app.start({ port }, () => {
    console.log(`graphql yoga started on port ${port}!`);
    console.log('starting took ', prettyMs(new Date() - started));
});
