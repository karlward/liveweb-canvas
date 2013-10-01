// HTTP Portion
var http = require('http');
var fs = require('fs'); // Using the filesystem module
var httpServer = http.createServer(requestHandler);
httpServer.listen(8080);

function requestHandler(req, res) {
    // Read index.html
    fs.readFile(__dirname + '/canvas_socket.html', 
        // Callback function for reading
        function (err, data) {
            // if there is an error
            if (err) {
                res.writeHead(500);
                return res.end('Error loading canvas_socket.html');
            }
            // Otherwise, send the data, the contents of the file
            res.writeHead(200);
            res.end(data);
        }
    );
}


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io').listen(httpServer);

// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
    // We are given a websocket object in our function
    function (socket) {
    
        console.log("We have a new client: " + socket.id);
        
        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('othermouse', function(data) {
            // Data comes in as whatever was sent, including objects
            console.log("Received: 'othermouse' " + data.x + " " + data.y);
            
            // Send it to all of the clients
            socket.broadcast.emit('othermouse', data);
        });
        
        socket.on('otherclear', function(data) {
            console.log("Received: 'otherclear'");
            socket.broadcast.emit('otherclear', data);
        });
        
        socket.on('otherfile', function(data) {
          console.log('otherfile' + data);
          socket.broadcast.emit('otherfile', data);
        });
        
        
        socket.on('disconnect', function() {
            console.log("Client has disconnected " + socket.id);
        });
    }
);