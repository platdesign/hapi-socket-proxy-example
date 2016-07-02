'use strict';


const Hapi = require('hapi');
const httpProxy = require('http-proxy');
const url = require('url');

const server = new Hapi.Server();

server.connection({
	host: '127.0.0.1',
	port: 8090
});



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
				passThrough: true,
				mapUri: function(req, cb) {

					req.url.hostname = 'localhost';
					req.url.port = 8080;

					let uri = 'http:'+url.format(req.url);

					req.headers.authorization = 'd5R0wk3AsjOCoNHSBHmXDg9cK2YhG0fLgZygGDlLunsvGihbdrry5KWCOslE5KSy';

					cb(null, uri, req.headers);
				}
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

