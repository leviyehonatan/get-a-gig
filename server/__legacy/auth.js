const express = require('express');
const passport = require('passport');
const config = require('config');
const router = express.Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**** 
 todo: 
    * check for ducplicate email
    * check for duplicate phone number
    * validate email
    * validate phone number(twilio)?
****/
router.post('/signup', async (req, res) => {
    try { 
        const { loginDetails } = req.body;
        const { username = null, password = null } = loginDetails || {};

        if (!username || !password) {
            throw new Error('invalid credentials'); 
        }

        const exists = await User.findOne({'loginDetails.username': username});
        if (exists) {
            throw new Error('username exists');
        }

        const user = await new User({loginDetails}).save();
        return res.json({
            ok: true, 
            statusText: 'user created', 
            token: getToken(user)
        });
    } catch (error) {
        res.status(400).json({statusText: error.message});
        //throw error;
    }
});

router.post('/login', async (req, res) => {
    try {
        const { loginDetails } = req.body;
        const { username = null, password = null } = loginDetails || {};

        if (!username || !password) {
            throw new Error('invalid credentials'); 
        }

        let user = await User.findOne({loginDetails: {username, password}});
        if (user) {
            user.loginDetails.lastLogin = Date.now();
            user.markModified('loginDetails.lastLogin');
            user.save().then(savedUser => {
                return res.json({
                    token: getToken(user)
                });
            });
        } else {
            return res.status(401).json({ok: false, statusText: 'username and password doesn\'t match' });
        }
    } catch (error) {
        return res.status(400).json({error});
    }
});

router.get('/all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let all = await User.find({});
    res.json(all);
});
router.post('/check', passport.authenticate('jwt', { session: false }), async (req, res) => {
    return res.json({ok: true});
        
    }
);

function getToken(user) {
    const { jwt: {secret, expiration}} = config
    return jwt.sign({
        _id: user._id
    }, 
    secret, { expiresIn: expiration })
}

module.exports = router;