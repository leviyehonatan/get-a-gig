module.exports = {
    mongo: {
        url: process.env.MONGO_CONNECTION || 'mongodb://mongo:27017/database'
    },
    port: process.env.SERVER_PORT || 3000,
    jwt: {
        secret: process.env.JWT_SECRET || 'keepitquiet',
        expiration: 60 * 60 * 24
    },
    facebook: {
        appId: '405262703603460',
        secret: '1ec1879d1df1f2a5f5616799cf9106d4'
    }
};
