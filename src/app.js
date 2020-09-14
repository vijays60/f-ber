/**
 * server configureation 
 * and all routes definition
 */
const express = require('express');
const bodyParser = require("body-parser");

// using local storage as DB to store all object
// information in files 
const { LocalStorage } = require('node-localstorage')
const db = new LocalStorage('./data');

// clear db
// db.clear();

// Logger library funtion to logg all request
 const { logger } = require('./api/lib/utils');

// import all router function
const taxiRoutes = require('./api/v1/routes/taxi-routes');
const bookingRoutes = require('./api/v1/routes/booking-routes');


const app = express()

// load all middleware functions
app.use(bodyParser.json());
app.use(logger);
app.use(express.static("./client"));

// configure routes
app.use("/api/v1/taxi", taxiRoutes);
app.use("/api/v1/booking", bookingRoutes);

// configure root url and redirect to UI page
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

////////////////////////////////////////
// Error Handlers functions 
////////////////////////////////////////

// Handle 404
app.use(function(req, res, next) {
    res.status(404)
    res.json({
        status: 'error',
        message: 'no such endpoint found!'
    })
});


// Print stacktarace and return only the error message
// Internal errors are captured here and json response sent
app.use(function(err, req, res, next) {
    console.log(err);
    res.status(err.status || 500)
    .json({
        status: 'error',
        message: err.message
    });
});

module.exports = app;
