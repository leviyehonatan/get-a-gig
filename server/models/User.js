const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    displayName: String,
    name: {
        givenName: String,
        familyName: String,
        middleName: String
    },
    picture: String,
    gender: String,
    photos: [String],
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: String,
    lastLogin: Date,
    facebook: {
        token: String,
        id: String
    },

    services: [Schema.Types.ObjectId],
    calendars: []
    // notifications: [],

    // contracts: [{
    //     serviceId: Number,
    //     contractType:
    // }],
});
mongoose.set('useCreateIndex', true);
const User = mongoose.model('User', userSchema);
module.exports = User;
