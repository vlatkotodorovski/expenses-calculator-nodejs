
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')

var usersSchema = new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    telephone: { type: Number, required: true },
    country: { type: String, required: true },
    password: { type: String, required: true },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

usersSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)

        const passwordHash = await bcrypt.hash(this.password, salt)

        this.password = passwordHash;
        next();
    } catch (error) {
        next(error)
    }
})

var User = mongoose.model('User', usersSchema);

module.exports = User;