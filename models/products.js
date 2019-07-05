

const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const ProductModel = mongoose.model('Product', new Schema({
    productName: { type: String, required: true },
    productDescription: { type: String },
    productType: { type: String },
    purchaseDate: { type: Date, required: true },
    price: { type: Number, required: true },
    user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}))

module.exports = ProductModel;
