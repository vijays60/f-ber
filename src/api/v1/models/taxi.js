var uniqid = require('uniqid');

const { LocalStorage } = require('node-localstorage')

const { Car, carSchema }  = require('./car');
const { Driver, driverSchema}  = require('./driver');
const { Location, locationSchema} = require('./location');

// Taxi
var schema = {
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

const TAXI_STATUS = {
    AVAILABLE: 'AVAILABLE',
    BOOKED: 'BOOKED',
    NOTAVAILABLE: 'NOTAVAILABLE'
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
        let taxis = db.getItem('taxis') ? JSON.parse(
                        db.getItem('taxis')
                    ) : [];
        taxis.push(this.toJSON());
        db.setItem('taxis', JSON.stringify(taxis));
    },
    update: function() {
        // save the data
        let taxis = db.getItem('taxis') ? JSON.parse(
            db.getItem('taxis')
        ) : [];
        let taxiIndex = taxis.findIndex(ele => ele.id === this._id);
        taxis[taxiIndex] = this.toJSON();

        // taxis.push(this.toJSON());
        db.setItem('taxis', JSON.stringify(taxis));
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
    delete: function(){
        // save the data
        let taxis = db.getItem('taxis') ? JSON.parse(
            db.getItem('taxis')
        ) : [];
        let taxiIndex = taxis.findIndex(ele => ele.id === this._id);
        if (taxiIndex) {
            taxis.splice(taxiIndex,1);
            // taxis.push(this.toJSON());
            db.setItem('taxis', JSON.stringify(taxis));
        }
        return taxiIndex;
    }
}


Taxi.getDetails = function(id) {
    let taxis = db.getItem('taxis') ? JSON.parse(
        db.getItem('taxis')
    ) : [];

    taxi = taxis.filter(ele => ele.id === id);
    if (taxi && taxi.length > 0){
        return new Taxi(taxi);
    } else {
        return null;
    }
}


Taxi.getAllDetails = function({ taxi_type }) {
    let taxis = db.getItem('taxis') ? JSON.parse(
        db.getItem('taxis')
    ) : [];
    if (taxi_type) {
        taxis = taxis.filter(ele => ele.taxi_type === taxi_type);
    }
    let taxiObjs = [];
    taxis.forEach(element => {
        taxiObjs.push(new Taxi(element));
    });
    return taxiObjs;
}

Taxi.validateReq = function(reqObject){
    return v.validate(reqObject, schema).valid;
}

//export Student object as a module
module.exports = { Taxi, TAXI_STATUS, TAXI_TYPE };
