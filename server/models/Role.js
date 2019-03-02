const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {type: String},
    includes: [{
        type: ObjectId,
        ref: 'Role',
    }]
});
