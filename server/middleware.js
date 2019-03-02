const config = require('config');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function getUserToken(req, res, next) {
    const {
        headers: { authorization }
    } = req;
    try {
        if (authorization) {
            let token = jwt.verify(authorization, config.jwt.secret);
            if (token) {
                let user = await User.findOne({ _id: token._id });
                req.user = user;
            }
        }
        next();
    } catch (err) {
        console.error(err.message);
        //next(err);
        next();
    }
}

module.exports = { getUserToken };
