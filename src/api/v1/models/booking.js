var uniqid = require('uniqid');
const { LocalStorage } = require('node-localstorage')

const { Taxi, taxiSchema, TAXI_TYPE } = require('./taxi');
const { Customer, customerSchema } = require('./customer');
const { Location, locationSchema} = require('./location');

const { carSchema }  = require('./car');
const { driverSchema}  = require('./driver');

const { calDistanceCost } = require('../../lib/utils');

var Validator = require('jsonschema').Validator;
var v = new Validator();

const db = new LocalStorage('./data');
const db_name = 'bookings';

const bookingSchema = {
    "id": "/SimpleBookiingSchema",
    "type": "object",
    "properties": {
      "taxi": {
          "type" : "object",
          "properties": {
            "driver": {"$ref": "/SimpleDriverSchema"},
            "car": {"$ref": "/SimpleCarSchema"},
            "taxi_type": {"type": "string"},
            "location": {"$ref": "/SimpleLocationSchema"}
          }
      },
      "customer": {"$ref": "/SimpleCustomerSchema"},
      "source":  {"$ref": "/SimpleLocationSchema"},
      "destination":  {"$ref": "/SimpleLocationSchema"},
      "status":  {"type": "string"},
    },
    "required": ["customer", "source", "destination"]
};

v.addSchema(carSchema, '/SimpleCarSchema');
v.addSchema(driverSchema, '/SimpleDriverSchema');
v.addSchema(taxiSchema, '/SimpleTaxiSchema');
v.addSchema(customerSchema, '/SimpleCustomerSchema');
v.addSchema(locationSchema, '/SimpleLocationSchema');

const BOOKING_STATUS = {
    STARTED: 'STARTED',
    FINISHED: 'FINISHED',
    CANCELED: 'CANCELED',
    DELETED: 'DELETED',
}

//constructor
function Booking({ 
    id, taxi, customer,
    source, destination, status
}){
    this.id = id ? id : uniqid();
    this.taxi = taxi ? new Taxi(taxi) : {};
    this.customer = customer ? new Customer(customer) : {};
    this.source = source ? new Location(source) : {};
    this.destination = destination ? new Location(destination) : {};
    this.status = status ? status : BOOKING_STATUS.STARTED;
    this.cost = 0;
    this.bookingTime =  new Date().getTime();
    this.tripEndtime = null;
}

Booking.prototype = {
    toJSON: function(){
        return {
            id: this.id,
            taxi: this.taxi.toJSON(),
            customer: this.customer.toJSON(),
            source: this.source.toJSON(),
            destination: this.destination.toJSON(),
            status: this.status,
            cost: this.cost,
            bookingTime: this.bookingTime
        };
    },
    add: function() {
        this.id = uniqid('trip-');
        // save the data
        let bookings = db.getItem(db_name) ? JSON.parse(
                        db.getItem(db_name)
                    ) : [];
        bookings.push(this.toJSON());
        db.setItem(db_name, JSON.stringify(bookings));
    },
    update: function() {
        // Update the data
        let bookings = db.getItem(db_name) ? JSON.parse(
            db.getItem(db_name)
        ) : [];
        let bookiIndex = bookings.findIndex(ele => ele.id === this.id);
        bookings[bookiIndex] = this.toJSON();

        db.setItem(db_name, JSON.stringify(bookings));
    },
    updateStatus: function(updateObj){
        let bookings = db.getItem(db_name) ? JSON.parse(
            db.getItem(db_name)
        ) : [];
        let bookiIndex = bookings.findIndex(ele => ele.id === this.id);
        if (bookiIndex >= 0) {
            Object.assign(bookings[bookiIndex], updateObj)
            db.setItem(db_name, JSON.stringify(bookings));
        }
    },
    delete: function(){
        this.updateStatus({
            status: BOOKING_STATUS.DELETED
        });
    },
    cancelBooking: function(){
        this.updateStatus({
            status: BOOKING_STATUS.CANCELED
        });
    },
    completeTrip: function(location){

        this.destination = new Location(location);
        
        // calculate cost
        // The price is 1 dogecoin per minute, and 
        // 2 dogecoin per kilometer. Pink cars cost an additional 5 dogecoin.
        this.cost = 0;
        if (this.taxi.taxi_type === TAXI_TYPE.PINK){
            this.cost += 5;
        } 
        this.cost += calDistanceCost(this.source, this.destination);

        this.status = BOOKING_STATUS.FINISHED;

        this.tripEndtime = new Date().getTime();

        // To calculate the time difference of two dates 
        let diff_In_Time = this.tripEndtime - this.bookingTime; 
        
        // To calculate the no. of mins between two dates 
        let diff_In_mins = Math.round((diff_In_Time/1000)/60); 
        this.cost += diff_In_mins;

        this.taxi.endtrip(this.destination);

        // update booking
        this.update();
    }
}

Booking.validateReq = function(reqObject){
    return v.validate(reqObject, bookingSchema).valid;
}

Booking.getCustomerBookings = function({
    customer
}){
    let bookings = db.getItem(db_name) ? JSON.parse(
        db.getItem(db_name)
    ) : [];
    bookings = bookings.filter(ele => (
        ele.customer.name === customer.name &&
        ele.status !== BOOKING_STATUS.DELETED
    ));
    let bookingObjs = [];
    bookings.forEach(element => {
        bookingObjs.push(new Booking(element));
    });
    return bookingObjs;
}

Booking.getDetails = function(book_id) {
    let bookings = db.getItem(db_name) ? JSON.parse(
        db.getItem(db_name)
    ) : [];

    booking = bookings.filter(ele => ele.id === id);
    if (booking && booking.length > 0){
        return new Booking(booking[0]);
    } else {
        return null;
    }
}

Booking.getDetails = function(book_id) {
    let bookings = db.getItem(db_name) ? JSON.parse(
        db.getItem(db_name)
    ) : [];

    booking = bookings.filter(ele => ele.id === book_id);
    if (booking && booking.length > 0){
        return new Booking(booking[0]);
    } else {
        return null;
    }
}

module.exports = { Booking, BOOKING_STATUS };
