const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: String,
    owner: { type: 'ObjectId', ref: 'User' },
    members: [
        {
            userId: { type: 'ObjectId', ref: 'User' }
        }
    ],
    description: String,
    photos: [
        {
            url: String
        }
    ],
    dependantService: [
        {
            serviceId: { type: 'ObjectId' }
        }
    ],
    pricing: {},
    expenses: {}
});

module.exports = mongoose.model('Service', serviceSchema);
