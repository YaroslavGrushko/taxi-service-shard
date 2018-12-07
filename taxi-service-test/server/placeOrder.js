function placeOrder(order, taxiID, callback) {
    // const TAXIS_ID = [1, 2, 3];
    // generate random taxiID:
    // var taxiID = TAXIS_ID[Math.floor(Math.random() * TAXIS_ID.length)];
    // data to send to main-server
    var data = {
        taxiID: taxiID,
        order: order
    };
    callback(data);
}

module.exports = placeOrder;