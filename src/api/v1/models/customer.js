const path = require("path");
//get user.js using path 

var _super = require(path.join(__dirname,'user'));
//Customer inherits all Person's methods
Customer.prototype = Object.create(_super.prototype);

//constructor
function Customer(user){
    _super.call(user); //parent
    // set any customer specific properties
    this.rating = 0;
}

//returns a reference to the Object constructor function that created 
Customer.prototype.constructor = Customer;

//export Customer object as a module
module.exports = Customer;
