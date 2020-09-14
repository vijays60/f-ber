/**
 * Taxi routes
 */
const { Router } = require("express");

const { Taxi, TAXI_TYPE} = require('../models/taxi');

const router = new Router();

/** 
 * Get all available taxi's
 * 
 * return: [ Taxi ]
 */
router.get("/", (req, res) => {
    // get all taxi's based on given type
    let taxis = Taxi.getAllAvilableTaxis(req.query)
    return res.json(taxis)
});

/**
 * Add a new taxi to service
 * 
 * input: {
 *  taxi_type: string
 *  car: Car
 *  driver: Driver
 *  location: Location
 * }
 * 
 * return taxi object
 * 
 */
router.post("/", (req, res) => {
    // get taxi_type, car_details location lat and long
    // from the req body

    // validate data
    if (Taxi.validateReq(req.body)) {

        // Object destructuring helps get only information needed
        // by the system
        const { driver, car, taxi_type, location } = req.body;
        var params = {
            driver: driver ? driver : {},
            car: car ? car : {},
            taxi_type: taxi_type ? taxi_type : '',
            location: location ? location : {}
        }

        // add to DB
        let taxi = new Taxi(params);
        taxi.add();

        // return status
        res.json(taxi.toJSON());
    } else {
        throw new Error('not a valid input!')
    }
});

/**
 * Update a taxi information 
 * allows only editable field to be updated
 * 
 * input: {
 *  taxi_type: string
 * }
 * 
 * return { 
 *  status: string <success | error >
 *  payload: taxi object
 * }
 * 
 */
router.put("/:id", (req, res) => {
    // get taxi id to update
    let taxi_id = req.params.id

    // get taxi type from the req body
    const {taxi_type} = req.body;

    // validate data
    if (
        taxi_type && 
        taxi_id &&
        Object.keys(TAXI_TYPE).indexOf(taxi_type.toUpperCase()) >= 0
    ) {
        let taxi = Taxi.getDetails(taxi_id);
        if (taxi){
            // update the taxi information
            taxi.taxi_type = TAXI_TYPE[taxi_type.toUpperCase()];
            taxi.update();
            res.json(taxi.toJSON());
        } else {
            throw new Error("Taxi information not found");
        }
    } else {
        throw new Error("Invalid input");
    }    
});


/**
 * Soft delete
 * Remove the taxi from service
 * 
 * input: taxi_id
 * 
 * return { 
 *  status: string <success | error >
 *  payload: taxi object
 * }
 */
router.delete("/:id", (req, res) => {
    // get taxi_id from req params
    let taxi_id = req.params.id

    if (taxi_id) {
        let taxi = Taxi.getDetails(taxi_id);

        if (taxi) {
            taxi.delete();
            res.json({
                status: 'SUCCESS',
                payload: taxi.toJSON()
            });
        } else {
            throw new Error("Not able to find the taxi");
        }
    }
    // remove taxi from the give service
});

module.exports = router;
