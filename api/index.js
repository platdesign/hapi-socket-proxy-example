'use strict';

var Hapi = require('hapi');
const SocketServer = require('socket.io');

//var server = new Hapi.Server();
//server.connection({ port: 8080 });

var io = SocketServer(8080, {
	path: '/ws'
});





io.on('connection', function (socket) {
		let counter = 0;

		socket.emit('test', 'Welcome');

		socket.on('burp', function () {
			counter++;
			socket.emit('test', 'Message count '+counter);
		});
});

//server.start();

