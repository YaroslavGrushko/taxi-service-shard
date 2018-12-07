 function genOrder(coord) {
     // get random coordinates of client from Db
     //  var getRandomCoord = require("../Db/getRandomCoord");
     //  var coord = getRandomCoord();

     var longitude = coord.Longitude;
     var latitude = coord.Latitude;
     // generate order
     var Order = require("./Order");
     var order = new Order(longitude, latitude);
     // send generated order to main server
     var sendOrder = require("./sendOrder");
     sendOrder(order);
 }


 module.exports = genOrder;