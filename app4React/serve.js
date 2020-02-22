var static = require('node-static');
var file = new static.Server('./');
var port = 4004;

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(port);

console.log('Serving on http://localhost:' + port + '/');
