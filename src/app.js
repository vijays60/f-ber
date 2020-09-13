const express = require('express');
const bodyParser = require("body-parser");

const { LocalStorage } = require('node-localstorage')
const db = new LocalStorage('./data');

// custom libraries
 const { logger } = require('./api/lib/utils');

// get all routes
const taxiRoutes = require('./api/v1/routes/taxi-routes');
const bookingRoutes = require('./api/v1/routes/booking-routes');

const app = express()

app.use(bodyParser.json());
app.use(logger);
app.use(express.static("./client"));

app.use("/api/v1/taxi", taxiRoutes);
app.use("/api/v1/booking", bookingRoutes);

app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// clear db
// db.clear();


////////////////////
// Error Handlers
////////////////////

// Handle 404
app.use(function(req, res, next) {
    res.status(404)
    res.json({
        status: 'error',
        message: 'no such endpoint found!'
    })
});

// Print stacktarace and return only the error message
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500)
    .json({
        status: 'error',
        message: err.message
    });
});


module.exports = app;
