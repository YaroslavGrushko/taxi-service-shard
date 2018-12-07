const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var config = require('../config');



function getRandomCoord(callback) {
    // Connection URL
    const url = config.get('my-mongo:mongo-url');
    // Database Name
    const dbName = config.get('my-mongo:dbName');

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {

        console.log("Connected successfully to server from getRandomCoord.js");

        const db = client.db(dbName);

        // Get the documents collection
        const collection = db.collection('clients');
        // $match: { ClientsShardingField: 1 }
        //get one item randomly
        collection.aggregate([
            { $sample: { size: 1 } }
        ]).toArray(function(err, docs) {
            if (err) {
                console.log("find error!");
                return
            }
            client.close();
            console.log("*** FINDED data from MongoDb (Postcode): " + JSON.stringify(docs[0].Postcode) + " ***");
            callback(docs[0]);
        });
    });
}

module.exports = getRandomCoord;