const express = require('express');
// for concurrency
var cluster = require('cluster');
var bodyParser = require("body-parser");
var config = require('./config');
var async = require('async');
// var log = require('./libs/log')(module);

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master(main-server) cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i++) {
        var worker = cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker(main-server) ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker(main-server) ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker(main-server)');
        cluster.fork();
    });
} else {
    // create node.js (express) server:
    // =================================
    const app = express();
    app.set('port', config.get('port'));
    // deal with Access-Control-Allow-Origin bag on client request
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
    });
    // use body Parser
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

    // Post requests:
    // handle post request from c-server (clients generator)
    app.post('/make-order', function(req, res) {
        var order = JSON.parse(req.body.js_code);
        console.log("order received from c-server to server = " + JSON.stringify(order));

        var calcOptimalTaxi = require("./calcOptimalTaxi");
        // get all taxis from Db
        var getCoord = require("./Db/getTaxisCoord");
        getCoord().then((data) => {
            var jsonData = JSON.stringify(data);
            //console.log("reserved taxis : " + jsonData);

            async.waterfall([
                async.apply(calcOptimalTaxi, order, data),
                function(closestTaxi, callback) {
                    // /////////////////////////////////////
                    // if closest taxi exists
                    if (closestTaxi != {}) {
                        // send order to t-server (taxis - srever)>>>
                        var sendOrderToTaxi = require("./sendOrderToTaxi");
                        // place order (form order)
                        var placeOrder = require("./placeOrder");
                        var taxiID = closestTaxi.taxiID;
                        placeOrder(order, taxiID, sendOrderToTaxi);
                        // <<<<<<<<<<<<<<<<<< send order to t-server
                    } else {
                        console.log("All taxis are busy Sorry:(")
                    }
                    callback();
                }
            ], (err, result) => {
                if (err) return err;
            });
        });

        // make response
        // res.end("ok");
    });
    // handle post request from t-server (taxis-server)
    app.post('/order-executed', function(req, res) {
        var js_code = JSON.parse(req.body.js_code);
        // get taxiID, review and order data from request
        var taxiID = js_code.taxiID;
        var review = js_code.review;
        var order = js_code.order;

        console.log("(FINAL RECEIVING) order received from t-server to server = " + JSON.stringify(order));
        console.log("Process(main-server): " + process.pid + " taxiID: " + taxiID + "\n  review: " + review + "\n order: " + JSON.stringify(order));

        // form taxi object
        var taxi = {};
        taxi.taxiID = taxiID;
        taxi.coord = order;
        taxi.free = true;
        // write to Db datails of executed order
        var updateT = require("./Db/updateT");
        updateT(taxi);
        // make response
        // res.end("ok");
    });

    app.listen(app.get('port'), () => {
        console.log('Server(main-server) started on port ' + app.get('port'));
        console.log('Process(main-server) ' + process.pid + ' is listening to all incoming requests on port ' + app.get('port'));
    });
    // ================================================

    // // let's launch START function only from first worker
    if (cluster.worker.id == 1) {
        // let's start our system from c-server.js start-point:
        var START = require("./clients/c-server");
        START();
    }
}