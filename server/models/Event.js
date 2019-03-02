const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    budget: {
        required
    },

    venue: {

    },
    
    services: [{
        serviceId: { type: ObjectId, ref: 'Service')},
        
        
    }],
    


    
});