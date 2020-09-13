// log all request
const logger = (req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    if (Object.keys(req.body).length) {
      console.log(req.body);
    }
    next();
  };
  
const pythagorean_distance = function(src, dest){
  var lat = dest.lat - src.lat;
  var long = dest.long - src.long;

  // Radius of the Earth in Km
  var R = 6371; 

  return Math.abs((Math.sqrt( lat * lat + long * long )) *  R);
}

// formula used as per 
// https://en.wikipedia.org/wiki/Haversine_formula
const haversine_distance = function(src, dest) {
    // Radius of the Earth in Km
    var R = 6371; 

    // Convert degrees to radians
    var rlat1 = src.lat * (Math.PI/180); 
    var rlat2 = dest.lat * (Math.PI/180); 

    // Radian difference
    var difflat = rlat2-rlat1; 
    var difflon = (dest.long - src.long) * (Math.PI/180);

    var d = 2 * R * Math.asin(
      Math.sqrt(
        Math.sin(
          difflat/2) * Math.sin(
            difflat/2) + Math.cos(
              rlat1) * Math.cos(
                rlat2) * Math.sin(
                  difflon/2) * Math.sin(
                    difflon/2) ) );
    return d;
  }


const calDistanceCost = function(src, dest){
  let coveredDistance = pythagorean_distance(src, dest);
  // TO DO calculate the time take
  // calculate cost
  // The price is 1 dogecoin per minute, and 
  // 2 dogecoin per kilometer. Pink cars cost an additional 5 dogecoin.

  return (coveredDistance * 2).toFixed(2)
  
}

module.exports = { 
  logger, haversine_distance, 
  pythagorean_distance, calDistanceCost 
};
  