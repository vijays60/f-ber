/**
 * Booking services
 */
const { Router } = require("express");
const { Taxi, TAXI_STATUS } = require('../models/taxi');
const { Booking, BOOKING_STATUS } = require('../models/booking');

const router = new Router();

/** 
 * Get all booking for given customer
 * Assumption is that user object is passed to request 
 * to simulate the value to be replaced by authorised value
 * 
 * Returns: Array of all bookings
 */
router.get("/", (req, res) => {
    // for the purpose of the demo 
    // lets get the user details from the header
    let user_name = req.get('USERNAME');

    let bookings = Booking.getCustomerBookings({customer: {name: user_name}});
    res.json(bookings);
});


/**
 * Get booking details for id
 * 
 * return {*} Booking object
 */
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
 * Register a Booking for customer
 * 
 * inpuet : 
 *  taxi{ taxy_type : <NORMAL|PINK> }
 *  customer { name: string }
 *  source : Location( lat: float, long: float)
 *  destination : Location( lat: float, long: float)
 * 
 * return :  Booking object
 * 
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

            // Create new booking
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
            // if no available return no taxis'
            throw new Error("All taxis are busy servicing please try again later!");
        }

    } else {
        throw new Error('Input not valid, missing values!');
    }
});

/**
 * Route to cancel or end the trip / booking
 * using action node to use the same route and multiple behaviour
 * 
 * input: {
 *  action : <END | CANCEL>,
 *  payload : Location{lat : float, long: float} (mandatory for end trip only)
 * }
 * 
 * return : Booking object
 */
router.put("/:id", (req, res) => {

    // get booking_id from req params
    let booking_id = req.params.id

    // We could use this based action and payload
    const { action, payload } = req.body;

    switch (action) {
        case "END": 
            // end trip
            let location = payload;
            if (location) {
                let booking = Booking.getDetails(booking_id);
                if(booking){
                    booking.completeTrip(location);
                    return res.json(booking.toJSON());
                } else {
                    throw new Error("No booking such information available");
                }
            } else {
                throw new Error("Unable to find end location!");
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

/**
 * Soft delete function 
 * mark status of booking as DELETED
 * 
 * innput : booking_id
 * 
 * return : {
 *  status: <success|error>
 *  payload: Booking Object
 * }
 */
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
