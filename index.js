const User = require('./models/users');
const express = require('express');
const Product = require('./models/products');
const myParser = require('body-parser');
const session = require('express-session');
var cors = require('cors')
const bcrypt = require('bcrypt');
// const User = require('./models/users')
const jwt = require('jsonwebtoken');
const jwtSecret = "secret";

const db = require('./connection')

var app = express();
app.listen(3000);

// app.use(session({ secret: "test", resave: true, saveUninitialized: true }));

app.use(myParser.json({ extended: true }));

app.use(cors())
// let allowCrossDomain = function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', "*");
//     res.header('Access-Control-Allow-Headers', "*");
//     next();
// }
// app.use(allowCrossDomain);

app.use(function (req, res, next) {
    console.log("access-token", req.header("access_token"))
    if (req._parsedUrl.pathname !== '/login' && req._parsedUrl.pathname !== '/register') {
        console.log('decoded token', jwt.verify(req.headers.access_token, jwtSecret));
        const decodedToken = jwt.verify(req.headers.access_token, jwtSecret);

        if (decodedToken === null) {
            res.send('Denied access').status(403);
        } else {
            User.findOne({ email: decodedToken.email }, (err, user) => {
                if (user !== null) {
                    req.decodedUserMail = decodedToken.email;
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

    User.findOne({ email }, (err, user) => {
        if (err) {
            res.send('Error from database').status(500);
        } else {
            if (user !== null) {
                if (bcrypt.compareSync(password, user.password)) {
                    const access_token = jwt.sign({ email: user.email }, jwtSecret);
                    res.send({ access_token, user })
                } else {
                    res.status(401).send("Password not correct")
                }
            } else {
                res.status(403).send('Credentials not correct');
            }
        }
    })

    
});

app.post("/register", (req, res, next) => {
    

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
                        res.status(406).send(err)
                        return next(err);
                    }
                    const access_token = jwt.sign({ email: newUser.email }, jwtSecret);
                    res.send({ access_token })
                })
            } else {
                res.status(406).send('User already exist')
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

    let newproduct = new Product({
        productName: productName,
        productDescription: productDescription,
        productType: productType,
        purchaseDate: purchaseDate,
        price: price
    });

    User.findOne({ email: req.decodedUserMail }, (err, user) => {
        if (user !== null) {
            user.products.push(newproduct);
            user.save();
            newproduct.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.send("New Product saved!");
            })
        } else {
            res.send('Error saving product')
        }
    })
})

app.get("/products", (req, res) => {
    User.findOne({ email: req.decodedUserMail })
        .populate('products')
        .exec((err, user) => {
            if (!err && user !== null) {
                res.send(user.products)
            } else {
                res.status(500).send("Error getting products")
            }

        })
})



app.get("/expenses", (req, res) => {
    User.findOne({ email: req.decodedUserMail })
        .populate('products')
        .exec((err, user) => {
            if (!err && user !== null) {
                res.send(user.products)
            } else {
                res.status(500).send("Error getting expenses")
            }

        })
    
})




app.delete('/products/:id', (req, res, next) => {
    Product.findByIdAndDelete({ _id: req.params.id }, function (err, data) {
        if (err) {
            return next(err)
        }
        User.findOne({ email: req.decodedUserMail })
            .populate('products')
            .exec((err, user) => {
                if (!err && user !== null) {
                    res.send(user.products)
                } else {
                    res.status(500).send("Error getting products")
                }

            })
    }
    )
})

app.get('/profile', (req, res) => {
    User.findOne({ email: req.decodedUserMail }, (err, user) => {
        if (!err && user !== null) {
            res.send(user)
        } else {
            res.status(500).send("Error getting User")
        }
    })
})

app.patch('/edit/:id', (req, res, next) => {
    console.log("id", req.body);

    let { productName, productDescription, productType, price, purchaseDate } = req.body;

    console.log(productName)
    Product.findByIdAndUpdate(req.params.id, {
        productName,
        productDescription,
        productType,
        price,
        purchaseDate
    }).then(resp => {
        console.log('resp', resp)
        res.send("OK")
    }).catch(err => {
        console.log(err)
        res.send("ERROR")
    })
    
    console.log('aSD')
})





