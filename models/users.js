// exports.create = function(firstname, lastname, email, dateOfBirth, telephone, country, password){
//     this.firstname = firstname;
//     this.lastname = lastname;
//     this.email = email;
//     this.dateOfBirth = dateOfBirth;
//     this.telephone = telephone;
//     this.country = country;
//     this.password = password;
// }


const mongoose = require('mongoose');
// import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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

var User = mongoose.model('User', usersSchema);

module.exports = User;