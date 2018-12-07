function preInitTaxis(callback) {
    // randomly generate taxi coordinates 
    var getTaxisCoordR = require("../Db/getTaxisCoordR");
    var taxiCoord = getTaxisCoordR();

    // insert it to Db
    var insertTcoord = require("../Db/insertTaxiCoords");
    insertTcoord(taxiCoord);
    callback();
}
module.exports = preInitTaxis;