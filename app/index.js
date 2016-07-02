'use strict';


var Hapi = require('hapi');
var httpProxy = require('http-proxy');

var server = new Hapi.Server();

server.connection({
	host: '0.0.0.0',
	port: 8090
})



const wsProxy = httpProxy.createProxyServer({ target:'http://localhost:8080' });

server.register([
	{ register: require('inert') },
	{ register: require('h2o2') }
], (err) => {


	server.route({
		method: 'GET',
		path: '/',
		handler: function(req, reply) {
			reply.file(__dirname + '/template.html');
		}
	});

	server.route({
		method: ['GET', 'POST'],
		path: '/ws/',
		handler: {
			proxy: {
				host: '127.0.0.1',
				port: '8080',
				passThrough: true
			}
		}
	});

	server.listener.on('upgrade', function(req, socket, head) {
		if(req.url.substr(0, 4) === '/ws/' && req.headers.upgrade === 'websocket') {
			wsProxy.ws(req, socket, head);
		}
	});




	server.start(function(err) {
		if (err) throw err;



		console.log('Proxy started @ ' + server.info.uri);
	});

})

