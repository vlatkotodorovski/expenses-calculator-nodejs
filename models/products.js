// exports.create = function(pn, pd, type, purchaseDate, price, userEmail ){
//     this.productName = pn;
//     this.productDescription = type;
//     this.productType = email;
//     this.purchaseDate = purchaseDate;
//     this.price = price;
//     this.userId = userEmail;
// }

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// var productSchema = new Schema({
//     productName: {type: String, required: true},
//     productDescription: {type: String},
//     productType: {type: String},
//     purchaseDate: {type: Number, required: true},
//     price: {type: Number, required: true},
//     userId: {type: Number, required:true}

// })

// var Product = mongoose.model('Product', productSchema);

// module.exports = Product;

const ProductModel = mongoose.model('Product', new Schema({
    productName: {type: String, required: true},
    productDescription: {type: String},
    productType: {type: String},
    purchaseDate: {type: Number, required: true},
    price: {type: Number, required: true},
    userId: {type: Number, required:true}

}))

module.exports = ProductModel;
// export default ProductModel;