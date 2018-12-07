function execOrder(taxiID, order, callback) {
    setTimeout(function() {
        const reviews = [0, 1, 2];
        // generate random review:
        var review = reviews[Math.floor(Math.random() * reviews.length)];
        // data to send to main-server
        var data = {
            taxiID: taxiID,
            review: review,
            order: order
        };
        console.log(JSON.stringify(data));
        callback(data);
    }, 10000);
}

module.exports = execOrder;