const MongoClient = require('mongodb').MongoClient;
var config = require('../config');
const assert = require('assert');
var TAXIS_COUNT = config.get('TAXIS_COUNT');

// getPlaces() async
async function getCoord() {
    var data = await getTaxisCoord();
    return data;
}

// get taxis coordinates from Db:
function getTaxisCoord() {
    return new Promise(resolve => {
        var taxisCoord = [];

        // Connection URL
        const url = config.get('my-mongo:mongo-url');
        // Database Name
        const dbName = config.get('my-mongo:dbName');

        // Use connect method to connect to the server
        MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server from getTaxisCoord.js");

            const db = client.db(dbName);
            findDocuments(db, function(data) {
                console.log("taxis were fetched succesfully");
                client.close();
                // delete id (first) item from fetched data>>>
                // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                // var processedData = data[0];
                // var index = [];

                // // build the index
                // for (var x in data) {
                //     index.push(x);
                // }

                // // build newData without id (without first row in processedData)
                // var newDATA = {};
                // for (var i = 1; i < index.length; i++) {
                //     newDATA[index[i]] = data[index[i]]
                // }
                // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                // <<<delete id (first) item from fetched data
                console.log(JSON.stringify(data));
                resolve(data);
            });
        });
    });
}
// get document from mongo
const findDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('taxisCoord');
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        callback(docs);
    });
}

module.exports = getCoord;