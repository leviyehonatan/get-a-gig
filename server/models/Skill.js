const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: String,
    parent: { type: ObjectId, ref: 'Skill'}
});

skillSchema.query.byName = function(name) {
    return this.where({ name: new RegExp(name, 'i') });
}

const skillModel = mongoose.model('Skill', skillSchema);

module.exports = skillModel;