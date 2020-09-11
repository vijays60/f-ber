const express = require('express');
const bodyParser = require("body-parser");

// get all routes
const taxiRoutes = require('./api/v1/routes/taxi-routes');
const bookingRoutes = require('./api/v1/routes/booking-routes');
const paymentRoutes = require('./api/v1/routes/payment-routes');

const app = express()

app.use(bodyParser.json());
// app.use(logger);
app.use(express.static("./client"));

app.use("/api/v1/taxi", taxiRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/payment", paymentRoutes);




app.get('/', (req, res) => {
    res.send('Hello World!')
});


module.exports = app;
