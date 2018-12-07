const MongoClient = require('mongodb').MongoClient;
var config = require('../config')
const assert = require('assert');
// this function only update taxi and Doesn't send callback
function updateT(taxi) {
    // "mongo-url": "mongodb://localhost:27017",
    // Connection URL
    const url = config.get('my-mongo:mongo-url');
    // Database Name
    const dbName = config.get('my-mongo:dbName');
    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        if (err) return err
        console.log("Connected successfully to server from updateT.js");

        const db = client.db(dbName);
        
        //update taxi
        updateDocuments(db, taxi, function() {
            console.log("TAXI_ID: "+taxi.taxiID+" is updated free status to "+ taxi.free);
            client.close();
           
        });
    });
}


const updateDocuments = function(db, taxi, callback) {
    // Get the documents collection
    const collection = db.collection('taxisCoord');
    var myquery = { taxisCoordShardingField: 1 , taxiID: taxi.taxiID };
    var newvalues = { $set: { taxi } };
    collection.updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        // console.log("1 document updated");
        callback();
    });
}
module.exports = updateT;