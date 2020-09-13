var uniqid = require('uniqid');

// Driver schema
const locationSchema = {
    "id": "/SimpleLocationSchema",
    "type": "object",
    "properties": {
      "lat": {"type": "float"},
      "long": {"type": "float"},
    },
    "required": ["lat", "long"]
  };



//constructor
function Location({ 
    lat, long
}){
    this.lat = lat ? lat : 0.0;
    this.long = long ? long : 0.0;
}

Location.prototype.toJSON = function(){
    return {
        lat: this.lat,
        long: this.long
    };
}

module.exports = {Location, locationSchema};
