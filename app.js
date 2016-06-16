var serialPort = require('serialport');
var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var util = require('util');
var exec = require('child_process').exec;

app.use("/", express.static(__dirname + "/public"));

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
	
	myPort.on("open", function(err){
		if (err) {
			console.log("error: " + err);
		} else {
			console.log('yay, serial port is open.');
			myPort.on("data", function(d) { 
				//console.log(d);
				if(mySocket) {
					mySocket.send(d);
				}
			});

			var restartChrome;

			// restartChrome = exec('osascript /Users/jeffrey.ong/Documents/OFF/subway-stories-node/chrome.scpt', function(err,stdout,stderr){
			// 	// console.log('stdout: ' + stdout);
			// 	// console.log('stderr: ' + stderr);
			// 	if (err !== null) {
			// 		console.log('exec error: ' + err);
			// 	}
			// });
		}
	});

	myPort.on("close", function(err){
		server.close();
		console.log('Port closed: Arduino disconnected or error.');
	});
};

var getPort = function(error, ports){
	
	var isArduinoConnected = false;

	for(var i in ports){
        // console.log(ports[i]);
		if(ports[i]['comName'].indexOf('cu.usbmodem') != -1){

			server.listen(8080);
			console.log('App is listening on localhost:8080');
			var port = ports[i]['comName'];
            console.log(port);
			isArduinoConnected = true; 
			initPort(port);
		}
	}

	if(!isArduinoConnected){
		console.log('Port not found. Ensure Arduino is connected to a USB port.');
	}

};

serialPort.list(getPort);
