var serialPort = require('serialport');
var express = require('express');
var http = require('http');
var app = express();

app.use("/", express.static(__dirname + "/public"));

var server = http.createServer(app);
server.listen(8080);
console.log('Listening on port 8080');

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
	'server': server
});

var mySocket = undefined;

wss.on('connection', function(ws){
	ws.on('message', function(msg){
		console.log(msg);
		myPort.write(msg);
	});

	ws.on('close', function(){
		mySocket = undefined;
	});

	mySocket = ws;
});

var initPort = function(portName){
	var options = {
		baudrate: 9600,
		parser: serialPort.parsers.readline('\r\n')
	}

	var myPort = new serialPort.SerialPort( portName, options);
	
	myPort.on('open', function() {
		console.log('yay, serial port is open.');
	});

	myPort.on('data', function(sensorVals){
		if(mySocket){
			mySocket.send(sensorVals);
		}
	});

	return myPort;
};

var getPort = function(error, ports){
	var port = ports[2]['comName'];
	console.log(port);
	initPort(port);
};

serialPort.list(getPort);
