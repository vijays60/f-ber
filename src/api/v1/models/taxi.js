var uniqid = require('uniqid');

const { LocalStorage } = require('node-localstorage')

const { Car, carSchema }  = require('./car');
const { Driver, driverSchema}  = require('./driver');
const { Location, locationSchema} = require('./location');

const { pythagorean_distance } = require('../../lib/utils');

// Taxi
var taxischema = {
    "id": "/SimpleTaxiSchema",
    "type": "object",
    "properties": {
      "driver": {"$ref": "/SimpleDriverSchema"},
      "car": {"$ref": "/SimpleCarSchema"},
      "taxi_type": {"type": "string"},
      "location": {"$ref": "/SimpleLocationSchema"}
    },
    "required": ["driver", "car", "location"]
  };


var Validator = require('jsonschema').Validator;
var v = new Validator();
v.addSchema(carSchema, '/SimpleCarSchema');
v.addSchema(driverSchema, '/SimpleDriverSchema');
v.addSchema(locationSchema, '/SimpleLocationSchema');


const db = new LocalStorage('./data');
const db_name = 'trips';

const TAXI_STATUS = {
    AVAILABLE: 'AVAILABLE',
    BOOKED: 'BOOKED',
    NOTAVAILABLE: 'NOTAVAILABLE',
    DELETED: 'DELETED'
}

const TAXI_TYPE = {
    NORMAL: 'NORMAL',
    PINK: 'PINK'
}

//constructor
function Taxi({ 
    id, driver, car, 
    taxi_type, location, status 
}){
    this.id = id ? id : null;
    this.driver = driver ? new Driver(driver) : {};
    this.car = car ? new Car(car) : {};
    this.taxi_type = taxi_type ? taxi_type : TAXI_TYPE.NORMAL;
    this.location = location ? new Location(location) : {};
    this.status = status ? status : TAXI_STATUS.AVAILABLE;
}

Taxi.prototype = {
    add: function(){
        this.id = uniqid('taxi-');
        // save the data
        let taxis = db.getItem(db_name) ? JSON.parse(
                        db.getItem(db_name)
                    ) : [];
        taxis.push(this.toJSON());
        db.setItem(db_name, JSON.stringify(taxis));
    },
    update: function() {
        // save the data
        let taxis = db.getItem(db_name) ? JSON.parse(
            db.getItem(db_name)
        ) : [];
        let taxiIndex = taxis.findIndex(ele => ele.id === this.id);
        taxis[taxiIndex] = this.toJSON();

        // taxis.push(this.toJSON());
        db.setItem(db_name, JSON.stringify(taxis));
    },
    toJSON: function() {
        return {
            id: this.id,
            driver: this.driver.toJSON(),
            car: this.car.toJSON(),
            taxi_type: this.taxi_type,
            location: this.location.toJSON(),
            status: this.status
        };
    },
    updateStatus: function(updateObj) {
        // update the data
        let taxis = db.getItem(db_name) ? JSON.parse(
            db.getItem(db_name)
        ) : [];
        let taxiIndex = taxis.findIndex(ele => ele.id === this.id);
        console.log(taxiIndex);
        if (taxiIndex >= 0) {
            Object.assign(taxis[taxiIndex], updateObj);

            // taxis.push(this.toJSON());
            db.setItem(db_name, JSON.stringify(taxis));
        }
        return taxiIndex;
    },
    delete: function(){
        // hard delete not recommended 
        // unless the requirement defines this feature
        // soft delete the record
        this.updateStatus({status: TAXI_STATUS.DELETED});
    },
    markBooked: function(){
        this.updateStatus({status: TAXI_STATUS.BOOKED});
    },
    endtrip: function(location){
        this.updateStatus({
            status: TAXI_STATUS.AVAILABLE,
            location
        });
    }
}

Taxi.getDetails = function(id) {
    let taxis = db.getItem(db_name) ? JSON.parse(
        db.getItem(db_name)
    ) : [];

    taxi = taxis.filter(ele => ele.id === id);
    if (taxi && taxi.length > 0){
        return new Taxi(taxi[0]);
    } else {
        return null;
    }
}


// get all available taxis
//
Taxi.getAllAvilableTaxis = function({ taxi_type }) {
    let taxis = db.getItem(db_name) ? JSON.parse(
        db.getItem(db_name)
    ) : [];
    if (taxi_type) {
        taxis = taxis.filter(ele => (
            ele.taxi_type === taxi_type &&
            ele.status === TAXI_STATUS.AVAILABLE
        ));
    } else {
        taxis = taxis.filter(ele => (
            ele.status === TAXI_STATUS.AVAILABLE
        ));
    }
    let taxiObjs = [];
    taxis.forEach(element => {
        taxiObjs.push(new Taxi(element));
    });
    return taxiObjs;
}

Taxi.getNearestTaxi = function(src){
    let nearestkm = undefined;
    let nearestTaxi = null;

    let taxis = db.getItem(db_name) ? JSON.parse(
        db.getItem(db_name)
    ) : [];

    taxis = taxis.filter(ele => (
        ele.status === TAXI_STATUS.AVAILABLE
    ));

    // TO-DO 
    // this loop is heavy O(n)
    // Best method is to calculate the progressive increase in 
    // cordinates values and get the taxis that are near and return them
    taxis.forEach(taxi => {
        let taxiDistance = pythagorean_distance(src, taxi.location);
        if (nearestkm == undefined || (taxiDistance < nearestkm) ){
            nearestkm = taxiDistance;
            nearestTaxi = taxi;
        }
    });

    if (nearestTaxi) {
        return new Taxi(nearestTaxi);
    } else {
        return null;
    }
}


// Validate the taxi input object to have 
// necessary information for sucessfull operation
Taxi.validateReq = function(reqObject){
    return v.validate(reqObject, taxischema).valid;
}

//export Student object as a module
module.exports = { Taxi, taxischema, TAXI_STATUS, TAXI_TYPE };
