

// log all request
const logger = (req, res, next) => {
    console.log(`${req.method} request for ${req.url}`);
    if (Object.keys(req.body).length) {
      console.log(req.body);
    }
    next();
  };
  
// formula used as per 
// https://en.wikipedia.org/wiki/Haversine_formula
const haversine_distance = function(loc1, loc2) {
    // Radius of the Earth in Km
    var R = 6371; 

    // Convert degrees to radians
    var rlat1 = loc1.lat * (Math.PI/180); 
    var rlat2 = loc2.lat * (Math.PI/180); 

    // Radian difference
    var difflat = rlat2-rlat1; 
    var difflon = (loc2.long - loc1.long) * (Math.PI/180);

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

module.exports = { logger, haversine_distance };
  