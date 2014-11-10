THREE.PointerLockControls = function ( camera ) {
	var zoom,vel;
	var ws = new WebSocket('ws://localhost:8080');
	var speed = 0;
	var zoomSpeed = 0;

	ws.onopen = function () {
		console.log("web socket is open");
	}

	ws.onmessage = function(msg){
		var sensorVals = msg.data.split(',');
		// lefthand analog sensor value range: 370 - 890  
		zoom = sensorVals[0];
		// righthand analog sensor value range: 80 - 680
		vel = sensorVals[1];
		if(vel > 420) moveLeft = true;
		else moveLeft = false;
		if(vel < 340) moveRight = true;
		else moveRight = false;
		if(zoom > 670) moveBackward = true;
		else moveBackward = false;
		if(zoom < 590) moveForward = true;
		else moveForward = false;
		speed = 7 * Math.abs( (vel-80) / 60000 - .005 );

		window.onmousedown = function(){
			console.log(zoom);
			console.log(vel);
		}
	}

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var velocity = new THREE.Vector3();
	var acceleration = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onKeyDown = function ( event ) {

		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true; 
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;
		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = true;

	this.getObject = function () {

		return yawObject;

	};

	this.update = function (time) {

		if ( scope.enabled === false ) return;

		var delta = 0.4*(time);
		var thisCameraZ = camera.position.z;

		if ( moveForward ) {
			// camera.position.z += 0.0025 * (150 - thisCameraZ) * delta;
			if(camera.position.z < 500){
				acceleration.z -= 0.005 * delta;
			}
			else{
				acceleration.z -= 0.1 * delta;	
			}
		}

		if ( moveBackward ) {
			// camera.position.z += 0.0005 * (2000 - thisCameraZ) * delta;
				acceleration.z += 0.1 * delta;

			// if(camera.position.z < 1000){
			// }
			// else{
			// 	acceleration.z += 0.1 * delta;	
			// }
		}			

		if ( moveLeft ) {
			if (speed){
				acceleration.x -= speed * delta;				
			}
			else{
				acceleration.x -= .1 * delta;				
			}
		}

		if ( moveRight ) {
			if (speed){
				acceleration.x += speed * delta;				
			}
			else{
				acceleration.x += .1 * delta;				
			}
		}		

		velocity.x += acceleration.x;
		velocity.z += acceleration.z;
		acceleration.x *= 0;
		acceleration.z *= 0;

		if (velocity.z == 0);
		else if (velocity.z < 0) velocity.z = Math.min(10, velocity.z ); 
		else if (velocity.z > 0) velocity.z = Math.max(-10, velocity.z ); 

		if (velocity.x == 0);
		else if (velocity.x < 0) velocity.x = Math.min(10, velocity.x ); 
		else if (velocity.x > 0) velocity.x = Math.max(-10, velocity.x ); 

		camera.position.x += velocity.x;
		camera.position.z += velocity.z;
		if(camera.position.x > 0) { 
			camera.position.x = Math.min(camera.position.x, 1750);
		}
		
		// if(camera.position.x === 1750) 	moveBackward = true;
		// else 							moveBackward = false;

		if(camera.position.x < 0) { 
			camera.position.x = Math.max(camera.position.x, -1750); 

		} 

		// if(camera.position.x === -1750 && moveLeft === true) moveBackward = true;
		// else 							moveBackward = false;

		camera.position.z = Math.min(Math.max(camera.position.z, 150), 2200);

		velocity.x *= .95;
		velocity.z *= .95;
	};
};
