const fs = require('fs');
const path = 'path';

const modelsPath = path.resolve(__dirname);
const models = {};
fs.readdirSync(__dirname).forEach(function(file) {
    if (fs.lstatSync(__dirname + '/' + file).isFile() && file !== 'index.js' && !file.startsWith('_')) {
        let moduleName = file.split('.')[0];
        models[moduleName] = require('./' + moduleName);
    }
});

module.exports = models;
