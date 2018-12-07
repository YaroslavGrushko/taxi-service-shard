// We need this to build our post string
var querystring = require('querystring');
var http = require('http');

function sendOrder(codestring) {
    // Build the post string from an object
    var post_data = querystring.stringify({
        'compilation_level': 'ADVANCED_OPTIMIZATIONS',
        'output_format': 'json',
        'output_info': 'compiled_code',
        'warning_level': 'QUIET',
        'js_code': JSON.stringify(codestring)
    });

    // An object of options to indicate where to post to
    var post_options = {
        //host: 'server',
        host: 'localhost',
		port: '5000',
        path: '/order-executed',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            console.log('Response: ' + chunk);
        });
    });
    console.log("order send to server from t-server")
        // post the data
    post_req.write(post_data);
    post_req.end();

}

module.exports = sendOrder;