#!/bin/sh 
	export PATH=$PATH:/usr/local/bin
	if [ $(ps ax | grep -v grep | grep "PM2" | wc -l) -eq 0 ]
	then	
		echo "Starting PM2, Subway Stories..."
		pm2 start /Users/currents/Desktop/subway-stories/app.js
	else
		pm2 restart app
	fi
