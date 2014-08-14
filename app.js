var express = require('express');
var http = require('http');
var app = express();

app.get('*', function (req, res) {
	res.sendfile('./index.html');
})

var server = http.createServer(app);
server.listen(8080);

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
	ws.on('close', function() {
		mySocket = undefined;
	})
	mySocket = ws;
});

var serialPort = require('serialport');
// Find the "comName" path that refers to the Arduino serial port connection
// Replace this path with what's printed out in the 'comName:' of the terminal when you start the node app


var myPortName = 'COM3';

var options = {
	baudrate: 9600,
	parser: serialPort.parsers.readline('\r\n')
};

// Once you've added the correct name for the Serial port, uncomment lines 41 - 51, then restart the server
var myPort = new serialPort.SerialPort( myPortName, options );

myPort.on('open', function() {
	console.log('yay, serial port is open');
});


myPort.on('data', function(sensorVals){
	if(mySocket){
		mySocket.send(sensorVals);
	}
});

/*
 serialPort.list( function (error, ports) {
 	console.log(ports);
 });
*/
// console.log(serialPort);