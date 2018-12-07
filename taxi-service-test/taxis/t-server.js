const express = require('express');
var bodyParser = require("body-parser");
var config = require('./config');
// var log = require('./libs/log')(module);
// for concurrency
var cluster = require('cluster');

if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master(taxi-server) cluster setting up ' + numWorkers + ' workers...');

    for (var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker(taxi-server) ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker (taxi-server)' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker (taxi-server)');
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
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    // Post requests:
    // handle post request
    app.post('/order-taxi', function(req, res) {
        console.log("req.body.js_code: " + req.body.js_code);
        var js_code = JSON.parse(req.body.js_code);
        var taxiID = js_code.taxiID;
        var order = js_code.order;

        console.log("order received from server to t-server")
        console.log("taxiID (from t-server) = " + taxiID);
        console.log("order (from t-server) = " + JSON.stringify(order));

        var execOrder = require("./execOrder");
        var sendExecOrder = require("./sendExecOrder");
        execOrder(taxiID, order, sendExecOrder);
        // make response
        // res.end("ok");
    });

    app.listen(app.get('port'), () => {
        console.log('Server started on port (taxi-server)' + app.get('port'));
        console.log('Process (taxi-server)' + process.pid + ' is listening to all incoming requests on port ' + app.get('port'));
    });
    // ================================================
}