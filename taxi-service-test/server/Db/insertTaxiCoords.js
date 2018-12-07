const MongoClient = require('mongodb').MongoClient;
var config = require('../config')
const assert = require('assert');

function insertTaxiCoords(taxiCoords) {
    // "mongo-url": "mongodb://localhost:27017",
    // Connection URL
    const url = config.get('my-mongo:mongo-url');
    // Database Name
    const dbName = config.get('my-mongo:dbName');
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        if (err) return err
        console.log("Connected successfully to server from insertTaxiCoord.js");

        const db = client.db(dbName);

        // drop previous collection if it exists
        db.collection("taxisCoord").drop(function(err, delOK) {
            // if (err) throw err;
            if (delOK) { console.log("Collection deleted:)"); } else {
                console.log("Their is already no taxisCoord collection:)");
            }
            // inicialize taxi coordinates
            // Get the documents collection
            insertDocuments(db, taxiCoords, function() {
                console.log("insertion is completed (insertTaxiCoords.js)");
                client.close();
            });
        });
    });
}

const insertDocuments = function(db, taxiCoords, callback) {
        // Get the documents collection
        const collection = db.collection('taxisCoord');

        // Insert some documents (taxiID + it's coordinates)
        collection.insertMany(
            taxiCoords,
            function(err, result) {
                if (err) return err
                console.log("Inserted taxis into the collection");
                callback(JSON.stringify(result));
            });
    }
    // const updateDocuments = function(db, taxiID, coordinates, callback) {
    //     // Get the documents collection
    //     const collection = db.collection('taxisCoord');
    //     var myquery = { taxiID: taxiID };
    //     var newvalues = { $set: { taxiID: taxiID, coordinates: coordinates } };
    //     collection.updateOne(myquery, newvalues, function(err, res) {
    //         if (err) throw err;
    //         // console.log("1 document updated");
    //         callback();
    //     });
    // }
module.exports = insertTaxiCoords;