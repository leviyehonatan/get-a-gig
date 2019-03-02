const chai = require('chai');
const chaiHttp = require('chai-http');
const testUsers = require('./users');
chai.use(chaiHttp);
process.env.MONGO_CONNECTION = 'mongodb://mongo:27017/test';
const config = require('config');

const User = require('../models/User');
// const { MongoMemoryServer } = require('mongodb-memory-server'); 
// const mongod = new MongoMemoryServer({debug: true});

var expect = chai.expect;

describe('Server Test', function() {
    this.timeout(5000);
    var server;

    function request() {
        return chai.request(server);
    }

    before(function(done) {
        this.timeout(10000);
        const app = require('../app');
        User.deleteMany({}).exec().then(() => {
            server = app;
            done();
        });
    })

    const signup = (user) => request()
            .post('/api/user/signup')
            .send(user);

    const login = (user) => {
        const { loginDetails: { username, password } } = user;
        return request()
            .post('/api/user/login')
            .send({ username, password });
    };

    let user = testUsers[0];
    let userToken;
    let user2 = testUsers[1];
    it('signup a user', function(done) {
        signup(user).end(function(err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
        });
    });

    it('login already signed up user', function(done) {
        login(user).end(function(err, res) {
            expect(err).to.be.null;
            expect(res.body).to.have.property('token');
            userToken = (res.body.token);
            done();
        });
    });

    it('login with non-existing user fails', function(done) {
        login(user2).end(function(err, res) {
            expect(res).to.have.status(401);
            done();
        })
    })

    it('try to signup with existing user and fail', function(done) {
        signup(user).end(function(err, res) {
            expect(res).to.have.status(400);
            done();
        })
    });

    it('get data which requires authorization', function(done) {
        request().get('/api/user/all')
            .set('Authorization', 'jwt ' + userToken)
            .end(function (err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });
    it('get data which requires authorization without token and fail', function(done) {
        request().get('/api/user/all')
            .end(function (err, res) {
                expect(res).to.have.status(401);
                done();
            });
    });
 });