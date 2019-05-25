const User = require('./models/users');
const express = require('express');
const Product = require('./models/products');
const myParser = require('body-parser');
const session = require('express-session');
// const User = require('./models/users')
const jwt = require('jsonwebtoken');
const jwtSecret = "secret";

const db = require('./connection')

var app = express();
app.listen(3000);

// app.use(session({ secret: "test", resave: true, saveUninitialized: true }));

app.use(myParser.json({ extended: true }));

let allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");
    next();
}
app.use(allowCrossDomain);

app.use(function (req, res, next) {
    if (req._parsedUrl.pathname !== '/login' && req._parsedUrl.pathname !== '/register') {
        console.log('decoded token', jwt.verify(req.headers.access_token, jwtSecret));
        const decodedToken = jwt.verify(req.headers.access_token, jwtSecret);

        if (decodedToken === null) {
            res.send('Denied access').status(403);
        } else {
            User.findOne({ email: decodedToken.email }, (err, user) => {
                if (user !== null) {
                    next();
                } else {
                    res.status(403).send('Denied access')
                }
            })
        }
    } else {
        next();
    }
})

app.post("/login", (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({ email, password }, (err, user) => {
        if (err) {
            res.send('Error from database').status(500);
        } else {
            if (user !== null) {
                const access_token = jwt.sign({ email: user.email }, jwtSecret);
                res.send({ access_token })
            } else {
                res.status(403).send('Credentials not correct');
            }
        }
    })

    // let user = new User({

    // })


    // user.save(function (err) {
    //     if (err) {
    //         return next(err);
    //     }
    //     res.send("User saved!")
    // })
});

app.post("/register", (req, res, next) => {
    // var firstname = req.body.firstname;
    // var lastname = req.body.lastname;
    // var email = req.body.email;
    // var dateOfBirth = req.body.dateOfBirth;
    // var telephone = req.body.telephone;
    // var country = req.body.country;
    // var password = req.body.password;

    const { firstname, lastname, email, dateOfBirth, telephone, country, password } = req.body;

    let newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        dateOfBirth: dateOfBirth,
        telephone: telephone,
        country: country,
        password: password
    });


    User.findOne({ email }, (err, user) => {
        if (err) {
            res.send('Error creating user');
        } else {
            if (!user) {
                newUser.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    const access_token = jwt.sign({ email: newUser.email }, jwtSecret);
                    res.send({ access_token })
                })
            } else {
                res.send('User already exist').status(406)
            }
        }
    })
});

app.post("/new-product", (req, res, next) => {
    var productName = req.body.productName;
    var productDescription = req.body.productDescription;
    var productType = req.body.productType;
    var purchaseDate = req.body.purchaseDate;
    var price = req.body.price;
    var userId = req.body.userId;

    let newproduct = new Product({
        productName: productName,
        productDescription: productDescription,
        productType: productType,
        purchaseDate: purchaseDate,
        price: price,
        userId: userId
    });

    newproduct.save(function (err) {
        if (err) {
            return next(err);
        }
        res.send("New Product saved!");
    })
})

app.get("/products", (req, res) => {
    Product.find({}, function (err, products) {
        if (err) {
            return next(err)
        }

        res.send(products)
    })
})

app.get("/expenses", (req, res) => {
    Product.find({}, function (err, products) {
        if (err) {
            return next(err)
        }

        res.send(products)
    })
})


app.delete('/products/:id', (req, res, next) => {
    Product.deleteOne({ _id: req.params.id }, function (err) {
        if (err) {
            return next(err)
        }
        res.send('Succesfully Deleted product')
    }
    )
})

app.patch('/products/:id', (req, res, next) => {
    Product.findByIdAndUpdate({ _id: req.params.id }, req.body, (err) => {
        if (err) {
            return next(err)
        }
        res.send('Succesfully Updated product')
    })
})



// var u1 = new users.create('admin', 'admin', 'admin@yahoo.com', '7 january', '075651010', 'Macedonia','00000')

// app.post('/register', (req,res)=>{
//     var firstname = req.body.firstname;
//     var lastname = req.body.name;
//     var email = req.body.email;
//     var dateOfBirth = req.body.dateOfBirth;
//     var telephone = req.body.telephone;
//     var country = req.body.country;
//     var password = req.body.password;

//     var newUser = new users.create(firstname, lastname, email, dateOfBirth, telephone, country, password)
// })

// app.post('/', (req,res)=>{
//     var email = req.body.emailLogin;
//     var password = req.body.passwordLogin;

//     //database checks

//     req.session.user = email;

//     //return respons to front end

// })


// app.post('/addProduct', (req, res)=>{
//     if(req.session.email){
//         var productName = req.body.productName;
//         var productDescription = req.body.prodDesc;
//         var productType = req.body.productType;
//         var purchaseDate = req.body.purchaseDate;
//         var price = req.body.price;
//         var userEmail = req.session.email;

//         // var p = new products.create(productName, productDescription, productType, purchaseDate, price, userEmail)

//         //send response to Front End
//     }

//     else {
//         res.status(403).send('Access denied');
//     }

// })



// console.log(p)