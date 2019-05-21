const users = require('./models/users');
const express = require('express');
const products = require('./models/products')
var app = express();

const myParser = require('body-parser');
app.use(myParser.urlencoded({extended:true}));

const session = require('express-session');
app.use(session({secret:"test"}));

var u1 = new users.create('admin', 'admin', 'admin@yahoo.com', '7 january', '075651010', 'Macedonia','00000')

app.post('/register', (req,res)=>{
    var firstname = req.body.firstname;
    var lastname = req.body.name;
    var email = req.body.email;
    var dateOfBirth = req.body.dateOfBirth;
    var telephone = req.body.telephone;
    var country = req.body.country;
    var password = req.body.password;

    var newUser = new users.create(firstname, lastname, email, dateOfBirth, telephone, country, password)
})

app.post('/login', (req,res)=>{
    var email = req.body.emailLogin;
    var password = req.body.passwordLogin;

    //database checks

    req.session.user = email;
    
    //return respons to front end

})

app.post('/addProduct', (req, res)=>{
    if(req.session.email){
        var productName = req.body.productName;
        var productDescription = req.body.prodDesc;
        var productType = req.body.productType;
        var purchaseDate = req.body.purchaseDate;
        var price = req.body.price;
        var userEmail = req.session.email;
    
        var p = new products.create(productName, productDescription, productType, purchaseDate, price, userEmail)

        //send response to Front End
    }

    else {
        res.status(403).send('Access denied');
    }
  
})

console.log(p)