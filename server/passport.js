const passport = require('passport');
const config = require('config');
const LocalStrategy = require('passport-local');
const FacebookTokenStrategy from 'passport-facebook-token';
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('./models/User');

passport.use(
    new FacebookTokenStrategy(
        {
            clientID: config.facebook.appId,
            clientSecret: config.facebook.secret
        },
        function(accessToken, refreshToken, profile, done) {
            console.log(
                'new user facebook',
                profile,
                accessToken,
                refreshToken,
                done
            );
            Users.create({
                displayName: profile.displayName,
                name: profile.name,
                gender: profile.gender,
                photos: profile.photos,
                emails: profile.emails,
                facebook: {
                    facebookId: profile.id,
                    token: refreshToken
                }
            });
        }
    )
);
passport.use(
    'jwt',
    new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: config.jwt.secret
        },
        function(payload, done) {
            User.findOne({ _id: payload._id }).then(user => {
                if (user) {
                    done(null, user);
                } else {
                    done(null, false);
                }
            });
        }
    )
);

module.exports = passport;
