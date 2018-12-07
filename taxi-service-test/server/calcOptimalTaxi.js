var config = require('./config');
var TAXIS_COUNT = config.get('TAXIS_COUNT');
var async = require('async');
// calculate optimal taxi by it's coordinates an order coordinates:
function calcOptimalTaxi(order, taxiCoords, callback) {
    var closestTaxi = {};

    async.waterfall([
        // find closest taxi
        async.apply(findFree, taxiCoords, order),
            // find closest taxi
            findClosest,
            // update clothest taxi free status to false
            updateTstatus
    ], (err, result) => {
        if (err) return err
        closestTaxi = result;
        console.log("closest taxi: "+ JSON.stringify(result));
        callback(null, closestTaxi);
    });
}

// find free taxis
function findFree(taxiCoords, order, callback) {
    var freeTaxis = [];
    taxiCoords.forEach((taxi) => {
        if (taxi.free == true) freeTaxis.push(taxi);
    });
    // return free taxis to find closes function
    callback(null, freeTaxis, order);
}

// find closest taxi function
function findClosest(freeTaxis, order, callback) {

    var closestTaxi = {};
    var distances = [];
    var latitude_o = order.latitude;
    var longitude_o = order.longitude;

    // if in freeTaxis array exists some items (taxis)
    if (freeTaxis.length > 0) {
        // calculate closest:>>>>>>>>>>>>>>>>>>>>>>>>>>>
        // calculate distances between taxis and client
        for (var i = 0; i < freeTaxis.length; i++) {
            // current taxiID
            var taxiID = freeTaxis[i].taxiID;
            var latitude_t = freeTaxis[i].coord.latitude;
            var longitude_t = freeTaxis[i].coord.longitude;

            var distance = calcDistance(latitude_o, longitude_o, latitude_t, longitude_t, "K");

            distances.push({
                taxiID: taxiID,
                distance: distance
            });
        }

        var min = distances[0].distance;
        var taxi = distances[0].taxiID;
        // find the closest taxi:
        distances.forEach(function (item, i, distances) {
            if (min > item.distance) {
                min = item.distance;
                taxi = item.taxiID;
            }
        });
        closestTdist = {
            taxiID: taxi,
            distance: min
        };

        freeTaxis.forEach((element) => {
            // if current taxiID== id of closest taxi
            if (element.taxiID == taxi) {
                closestTaxi.taxiID = element.taxiID;
                closestTaxi.coord = element.coord;
                closestTaxi.free = false;
            }
        });
        //        calculate closest:<<<<<<<<<<<<<<<<<<<<<<<
    }
    // pass closestTaxi to final point of series
    callback(null, closestTaxi);
}

// function of calculating distance between coordinates
function calcDistance(lat1, lon1, lat2, lon2, unit) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    } else {
        var radlat1 = Math.PI * lat1 / 180;
        var radlat2 = Math.PI * lat2 / 180;
        var theta = lon1 - lon2;
        var radtheta = Math.PI * theta / 180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit == "K") {
            dist = dist * 1.609344
        }
        if (unit == "N") {
            dist = dist * 0.8684
        }
        return dist;
    }
}

function updateTstatus(closestTaxi, callback) {
    if (closestTaxi != {}) {
        // inicialize updateTstatus
        var updateT = require("./Db/updateT");
        updateT(closestTaxi);
    }
    // send closestTaxi to final callback of async.series
    callback(null, closestTaxi);
}

module.exports = calcOptimalTaxi;