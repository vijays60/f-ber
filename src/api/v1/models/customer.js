const path = require("path");


// Customer schema
const customerSchema = {
    "id": "/SimpleCustomerSchema",
    "type": "object",
    "properties": {
      "id": {"type": "string"},
      "name": {"type": "string"},
      "rating": {"type": "float"},
    },
    "required": ["name"]
};

//get user.js using path 
var _super = require(path.join(__dirname,'user'));
//Customer inherits all Person's methods
Customer.prototype = Object.create(_super.prototype);

//constructor
function Customer(params){
    _super.call(this, params); //parent
    // set any customer specific properties
    this.rating = 0;
}

//returns a reference to the Object constructor function that created 
Customer.prototype.constructor = Customer;

//export Customer object as a module
module.exports = { Customer, customerSchema };
