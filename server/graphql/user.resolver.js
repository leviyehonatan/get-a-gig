const User = require('../models/User');
const { sign } = require('jsonwebtoken');
const config = require('config');
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs');
const { getUserId } = require('../util');

class ResponseValidationError extends Error {
    constructor(path, message) {
        super(message);
        this.path = path;
        this.name = 'ResponseValidationError';
    }
}

function formatError(err) {
    if (err.name === 'ValidationError' && err.errors) {
        return Object.entries(err.errors).map(entry => {
            if (entry instanceof String) {
                //ignore
            } else {
                const { path, message } = entry[1];
                return { path, message };
            }
        });
    } else if (err.name === 'ResponseValidationError') {
        return [{ path: err.path, message: err.message }];
    }
    return [{ path: err.path || 'unknown', message: err.message }];
}

module.exports = {
    Query: {
        async profile(parent, _, context) {
            const userId = getUserId(context);
            const user = await User.findById(userId);
            if (!user) throw new Error('Unauthorized Request');
            return user;
        },
        async searchMembers(_, { name, limit = 20 }) {
            const nameRegex = new RegExp(name);
            return await User.find({
                displayName: nameRegex
            }).limit(limit);
        }
    },
    Mutation: {
        async signup(_, { loginInformation }) {
            try {
                const { password } = loginInformation;
                if (password.length < 5 || password.length > 50) {
                    throw new ResponseValidationError('password', 'Please choose a password with at least 5 chars');
                }
                //loginDetails.password = await bcrypt.hash(loginDetails.password, 10);
                const user = await new User({ loginInformation }).save();
                console.log('created new user', user);
                return {
                    token: signToken(user)
                };
            } catch (err) {
                return {
                    errors: formatError(err)
                };
            }
        },
        async login(_, { loginInformation }) {
            const { email, password } = loginInformation;
            if (!email || !password) {
                throw new Error('invalid credentials');
            }
            let user = await User.findOne({
                email: email,
                password: password
            });
            if (user) {
                user.lastLogin = Date.now();
                user.markModified('lastLogin');
                return user.save().then(savedUser => {
                    return {
                        token: signToken(user)
                    };
                });
            } else {
                throw new Error("username and password doesn't match");
            }
        },
        async facebookLogin(_, { facebookToken }, req) {
            const apiVersion = 'v3.2';
            const facebookGraph = 'https://graph.facebook.com/';
            const baseUrl = facebookGraph + apiVersion;

            let facebookData = await fetch(
                baseUrl + '/me?fields=name,first_name,last_name,email,id,picture&access_token=' + facebookToken
            ).then(response => response.json());
            let existing = await User.findOne({
                'facebook.id': facebookData.id
            });
            if (existing) {
                const {
                    picture: {
                        data: { url }
                    }
                } = facebookData;
                existing.profile = url;
                await existing.save();
                return {
                    token: signToken(existing)
                };
            } else {
                const {
                    picture: {
                        data: { url }
                    },
                    name: displayName,
                    id,
                    email,
                    first_name: givenName,
                    lastName: familyName,
                    middle_name: middleName
                } = facebookData;
                let user = await new User({
                    displayName,
                    name: {
                        givenName,
                        familyName,
                        middleName
                    },
                    email,
                    picture: url,
                    facebook: {
                        id,
                        token: facebookToken
                    }
                }).save();
                console.log('new user', user);
                return {
                    token: signToken(user)
                };
            }
        }
    }
};

function signToken(user) {
    const {
        jwt: { secret, expiration }
    } = config;
    return sign(
        {
            _id: user._id
        },
        secret,
        { expiresIn: expiration }
    );
}
