const path = require("path");
//get user.js using path 


// Driver schema
const driverSchema = {
    "id": "/SimpleDriverSchema",
    "type": "object",
    "properties": {
      "id": {"type": "string"},
      "name": {"type": "string"},
      "license_no": {"type": "string"},
    },
    "required": ["name"]
  };


var _super = require(path.join(__dirname,'user'));
//Driver inherits all Person's methods
Driver.prototype = Object.create(_super.prototype);

//constructor
function Driver(params){
    _super.call(this, params); //parent
    // set any Driver specific properties
    this.license_no = 0;
}

//returns a reference to the Object constructor function that created 
Driver.prototype.constructor = Driver;

//export Driver object as a module
module.exports = { Driver, driverSchema};
