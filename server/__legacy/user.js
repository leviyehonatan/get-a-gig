const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/User');

router.get('/all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    let all = await User.find({});
    res.json(all);
});

router.get('/all/delete', async (req, res) => {
    let deleteResponse = await User.deleteMany({});
    res.json(deleteResponse);
});

module.exports = router;