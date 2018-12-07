var config = require('../config');
var CLIENTS_NUM = config.get('CLIENTS_NUM');
var TIME_MIN = config.get('TIME_MIN');
var TIME_MAX = config.get('TIME_MAX');
var async = require('async');

function START() {
    // pre init taxis coordinates
    var preInitTaxis = require("./preInitTaxis");
    // exec consistently
    async.series([
        preInitTaxis,
        emulateClients
    ], function(err, result) {
        if (err) return err
    });
}

function emulateClients() {
    // emulate clients and their's requests
    for (var i = 0; i < CLIENTS_NUM; i++) {
       var time= Math.random() * (TIME_MAX - TIME_MIN) + TIME_MIN;
        // set timer (with 1sec deley) that occurce ones
        setTimeout(function() {
            // create client:
            // =================================

            // create order of current client
            var genOrder = require("./genOrder");
            var getRandomCoord = require("../Db/getRandomCoord")
            getRandomCoord(genOrder);

            // ================================================
        }, time);
    }
}
module.exports = START;