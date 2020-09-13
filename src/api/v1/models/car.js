var uniqid = require('uniqid');


const carSchema = {
    "id": "/SimpleCarSchema",
    "type": "object",
    "properties": {
      "id": {"type": "string"},
      "car_number": {"type": "string"},
    },
    "required": ["car_number"]
  };

//constructor
function Car({ 
    id, car_number
}){
    this.id = id ? id : uniqid();
    this.car_number = (
        car_number ? car_number.toUpperCase() : '-'
    );
}


Car.prototype.toJSON = function(){
    return {
        id: this.id,
        car_number: this.car_number
    };
}

module.exports = { Car, carSchema };
