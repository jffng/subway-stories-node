THREE.PointerLockControls = function ( camera ) {
	var speed;
	var ws = new WebSocket('ws://localhost:8080');

	ws.onopen = function () {
		console.log("web socket is open");
	}

	ws.onmessage = function(msg){
		var sensorVals = msg.data.split(',');
		var zoom = sensorVals[0];
		var vel = sensorVals[1];
		if(msg.data > 550) moveLeft = true;
		else moveLeft = false;
		if(msg.data < 470) moveRight = true;
		else moveRight = false;
		speed = 2 * Math.abs( msg.data / 102300 - .005 );

		window.onmousedown = function(){
			console.log(msg.data);
			console.log(speed);
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

	this.update = function ( ) {

		if ( scope.enabled === false ) return;

		var delta = 0.4*(Date.now() - time);

		if ( moveForward ) velocity.z -= 0.15 * delta;
		if ( moveBackward ) velocity.z += 0.15 * delta;

		if ( moveLeft )  acceleration.x -= speed * delta; 
		if ( moveRight ) acceleration.x += speed * delta;

		velocity.x += acceleration.x;
		acceleration.x *= 0;

		if (velocity.z == 0);
		else if (velocity.z < 0) velocity.z = Math.min(10, velocity.z ); 
		else if (velocity.z > 0) velocity.z = Math.max(-10, velocity.z ); 

		if (velocity.x == 0);
		else if (velocity.x < 0) velocity.x = Math.min(8, velocity.x ); 
		else if (velocity.x > 0) velocity.x = Math.max(-8, velocity.x ); 


		camera.position.x += velocity.x;
		camera.position.z += velocity.z;
		if(camera.position.x > 0) { camera.position.x = Math.min(camera.position.x, 1750);  }
		if(camera.position.x < 0) { camera.position.x = Math.max(camera.position.x, -1750); } 
		camera.position.z = Math.min(Math.max(camera.position.z, 150), 2200);

		velocity.x *= .99;
		velocity.z *= .9;
	};

};