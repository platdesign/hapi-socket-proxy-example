'use strict';

// Deps
const SocketServer = require('socket.io');

// Config
const AUTH_TOKEN = 'd5R0wk3AsjOCoNHSBHmXDg9cK2YhG0fLgZygGDlLunsvGihbdrry5KWCOslE5KSy';


// Init Socket-Server
const io = SocketServer(8080, {
	path: '/ws'
});


// Auth middleware
io.use(function(socket, next) {

	let handshake = socket.handshake;
	if(handshake.headers.authorization === AUTH_TOKEN) {
		next();
	} else {
		socket.disconnect();
		next('Missing Auth');
	}

});


// on connection handler
io.on('connection', function (socket) {
		let counter = 0;

		socket.emit('test', 'Welcome');

		socket.on('burp', function () {
			counter++;
			socket.emit('test', 'Message count '+counter);
		});
});
