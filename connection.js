const mongoose = require("mongoose");


var url = "mongodb+srv://admin:admin@expensescalculator-9bcy1.mongodb.net/test?retryWrites=true";

mongoose.connect(url);

mongoose.Promise = global.Promise

let db = mongoose.connection;

db.on("error", console.error.bind("Mongo Connection Error"));