//////////////////////////////////////////
///
///			SUBWAY CAR GRAPHICS
///
//////////////////////////////////////////

var subwayCarLoader = function () {
	var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
		map:THREE.ImageUtils.loadTexture('img/full_subway_20_windows.png')
	});
	img.map.needsUpdate = true; //ADDED
	img.transparent = true;
	this.subwayMesh = new THREE.Mesh(new THREE.PlaneGeometry(3500, 397), img);
	scene.add(this.subwayMesh);
}

subwayCarLoader.prototype.setPos = function(timer) {
	var noise = (.5-Math.random())*.075*(timer);
	this.subwayMesh.position.y += noise;
	this.subwayMesh.position.y = Math.min(Math.max(-30,this.subwayMesh.position.y),-20); 
}

//////////////////////////////////////////
///
///			SKETCHES
///
//////////////////////////////////////////

passengerObject = function() {
	this.object3D = new THREE.Object3D;
}

passengerObject.prototype.setPos = function(delta) {
	var noise = (.5-Math.random())*.1*delta;
	this.object3D.position.y += noise;
	this.object3D.position.y = Math.min(Math.max(-5,this.object3D.position.y),5); 
}

passengerLoader = function (numPassengers) {
	var img = new THREE.MeshBasicMaterial({
	map:THREE.ImageUtils.loadTexture('img/subway_'+numPassengers+'.png')
	})
	img.map.needsUpdate = true; //ADDED
	img.transparent = true;

	switch( numPassengers ){
	case 2:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(100,140), img );
	this.passengerMesh.position.set(numPassengers*110 - 1410, -35, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 3:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1420, -55, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 4:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1420, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 5:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1420, -35, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 6:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1455, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 7:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(100,135), img );
	this.passengerMesh.position.set(numPassengers*110 - 1415, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 17:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1430, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 21:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1430, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 22:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1440, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 23:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1480, -40, -50);
	passengers.object3D.add(this.passengerMesh);
	break;

	case 24:  
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1440, -50, -50);
	passengers.object3D.add(this.passengerMesh);
	break; 

	default:
	this.passengerMesh = new THREE.Mesh( new THREE.PlaneGeometry(112,150), img );
	this.passengerMesh.position.set(numPassengers*110 - 1400, -40, -50);
	passengers.object3D.add(this.passengerMesh);  
	break;
	} 
}

//////////////////////////////////////////
///
///			BACKGROUND + POLES
///
//////////////////////////////////////////

var Background = function(num){
	var img = new THREE.MeshBasicMaterial({
		map:THREE.ImageUtils.loadTexture('img/subway_tile_wall.jpg')
	});
	
	img.map.needsUpdate = true;

	var geometry = new THREE.PlaneGeometry(1200, 695);
	this.tile = new THREE.Mesh( geometry, img);
	this.tile.position.set(num*1200, 155, -100); 
	scene.add(this.tile);
}

Background.prototype.setPos = function(delta){
	// console.log(delta);
	this.tile.position.x -= 12;

	if(this.tile.position.x <= -14400) this.tile.position.x += 28800;
}

var Pole = function(x,y,z,h,c, dist) {
	this.increment = true;

	this.initPos = x;
	this.dist = dist;

	var geometry = new THREE.CubeGeometry( 100, h, 50 );
	var material = new THREE.MeshBasicMaterial( {color: c} );

	var poleMaterial = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
		map:THREE.ImageUtils.loadTexture('img/pole-texture-flat.jpg')
	});
	img.map.needsUpdate = true; //ADDED
	img.transparent = true;

	this.cube = new THREE.Mesh( geometry, poleMaterial );
	scene.add(this.cube);
	this.cube.position.set(x - dist, y, z);
}


Pole.prototype.setPos = function (mytime, speed) {
	this.cube.position.x -= speed; 

	if (this.cube.position.x <= -8000) this.cube.position.x += 16000;
}