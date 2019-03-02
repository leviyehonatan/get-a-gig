const config = require('config');
const { verify } = require('jsonwebtoken');

class AuthError extends Error {
    constructor() {
        super('Not authorized');
    }
}

function getUserId(context) {
    const Authorization = context.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const verifiedToken = verify(token, config.jwt.secret);
        return verifiedToken && verifiedToken._id;
    }
    throw new Error('Unauthorized');
}

module.exports = {
    getUserId
};
