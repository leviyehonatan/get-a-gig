const express = require('express');
const router = express.Router();
const faker = require('faker');
const User = require('../models/User');

router.get('/clearusers', async function(req, res) {
    await User.deleteMany({});
    res.json({ message: 'cleared users' });
});

const fakeusers = 'https://randomuser.me/api/?results=50';

router.get('/fakeusers', async function(req, res) {
    try {
        let howMany = 50;
        console.log(`faking ${howMany} users`);
        let users = [];
        while (howMany > 0) {
            howMany -= 1;
            users.push(
                new User({
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    displayName: faker.name.findName(),
                    name: {
                        firstName: faker.name.firstName(),
                        lastName: faker.name.lastName()
                    },
                    gender: faker.helpers.randomize('mf')
                })
            );
        }
        await User.insertMany(users);
        res.json({ message: 'created' });
    } catch (err) {
        throw new Error(err.message);
    }
});
module.exports = router;
