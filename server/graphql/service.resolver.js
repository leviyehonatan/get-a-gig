const { getUserId } = require('../util');
const Service = require('../models/Service');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

module.exports = {
    Query: {
        async getUserServices(_, {}, context) {
            const userId = getUserId(context);
            return await Service.find({ owner: ObjectID(userId) });
        },
        async getUserService(_, { id }, context) {
            const userId = getUserId(context);
            return await Service.findOne({ owner: ObjectID(userId), _id: ObjectID(id) });
        }
    },
    Mutation: {
        async saveService(_, { service }, context) {
            const userId = getUserId(context);
            if (service.id) {
                const result = await Service.findOneAndUpdate(
                    { owner: ObjectID(userId), _id: ObjectID(service.id) },
                    service,
                    { new: true }
                );
                return result;
            } else {
                let service = await new Service({ ...service, owner: new ObjectID(userId) }).save();
                return service;
            }
        },
        async deleteUserService(_, { id }, context) {
            const userId = getUserId(context);
            await Service.deleteOne({ owner: ObjectID(userId), _id: id });
            return id;
        }
    }
};
