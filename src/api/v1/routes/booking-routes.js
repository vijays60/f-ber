const { Router } = require("express");
const { Taxi, TAXI_STATUS } = require('../models/taxi');
const { Booking, BOOKING_STATUS } = require('../models/booking');

const router = new Router();

/** 
 * Booking services
 * 
 * Returns: Array of all bookings
 */
router.get("/", (req, res) => {
    // for the purpose of the demo 
    // lets get the user details from the header
    let user = req.get('USERNAME');
    let bookings = Booking.getCustomerBookings({customer: {name: user}});
    res.json(bookings);
});

router.get("/:id", (req, res) => {
    // get booking id to update
    let booking_id = req.params.id

    let booking = Taxi.getDetails(booking_id);
    if (booking) {
        res.json(booking.toJSON());
    } else {
        throw new Error("No details found");
    }
});

/**
 * Create new Booking 
 */
router.post("/", (req, res) => {
    // validate the input parameter
    if (Booking.validateReq(req.body)) {
        const {
            taxi, customer,
            source, destination
        } = req.body;

        // check if their any available taxis
        if (Taxi.getAllAvilableTaxis(taxi).length > 0){
            // get the nearest taxi
            let nearTaxi = Taxi.getNearestTaxi(source);

            // update taxi status
            nearTaxi.markBooked();

            // create new booking 
            let booking = new Booking({
                taxi: nearTaxi,
                customer,
                source,
                destination
            });
            booking.add();

            // retrun booking
            res.json(booking.toJSON());

        } else {
            // if not return no taxis'
            throw new Error("All taxis are busy servicing please try again later!");
        }

    } else {
        throw new Error('Input not valid, missing values!');
    }
});

router.put("/:id", (req, res) => {

    // get booking_id from req params
    let booking_id = req.params.id

    // We could use this based action and payload
    const { action, payload } = req.body;

    switch (action) {
        case "END": 
            // end trip
            let location = payload;
            let booking = Booking.getDetails(booking_id);
            if(booking){
                booking.completeTrip(location);
                return res.json(booking.toJSON());
            } else {
                throw new Error("No booking such information available");
            }
        case "CANCEL":
            // cancel trip action
            // current implementation dosn't allow to cancel
            // since the trip has already started
            throw new Error("Feature not available yet!");
        default :
            throw new Error("no action");
    }
    
});

router.delete("/:id", (req, res) => {
    // get booking_id from req params
    let booking_id = req.params.id

    if (booking_id) {
        let booking = Booking.getDetails(booking_id);

        if (booking) {
            booking.delete();
            res.json({
                status: 'SUCCESS',
                payload: booking.toJSON()
            });
        } else {
            throw new Error("Not able to find the booking");
        }
    }
    // remove taxi from the give service
});

module.exports = router;
