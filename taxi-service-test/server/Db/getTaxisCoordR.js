var config = require('../config');
var TAXIS_COUNT = config.get('TAXIS_COUNT');
// get taxis coordinates randomly:
function getTaxisCoordR() {
    var taxisCoord = [];
    // let's randomly inicialize taxis coorinates
    for (var i = 0; i < TAXIS_COUNT; i++) {
        var coord = {};
        // longitude range
        const LONG_MIN = -0.5;
        const LONG_MAX = 0.5;
        // latitude range
        const LAT_MIN = 51.4;
        const LAT_MAX = 51.7;

        coord.longitude = Math.random() * (LONG_MAX - LONG_MIN) + LONG_MIN;
        coord.latitude = Math.random() * (LAT_MAX - LAT_MIN) + LAT_MIN;
        taxisCoord.push({ taxiID: i, coord: coord, free: true });
    }

    return taxisCoord;
}
module.exports = getTaxisCoordR;