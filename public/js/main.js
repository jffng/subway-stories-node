$(document).ready(function() {
	$('body').addClass("loading");
	
	init();    
	initAudio();
	animate();
});

var camera, scene, renderer, audio;
var subwayCar, passengers, background, poles, polesB;
var controls, noise, initTime = Date.now();
var lastTime = 0;
var speedIncrement = 0;
var poleReset = 0;

function init() {
	$('body').append('<div id="container"></div>');
	$('#container').append('<div id="info"></div>');
	$('#info').addClass('info');

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );

	$('#container').append(renderer.domElement);

	// camera 
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000); 
	camera.position.set(-20, 0, 1500);
	camera.lookAt(0,0,0); 

	// scene 
	scene = new THREE.Scene();
	subwayCar = new subwayCarLoader();

	// data structures
	poles = [];
	polesB = [];
	background = [];
	passengers = new passengerObject();

	for (var i = 1; i < 25; i++){
		passengerLoader(i);

		if(i % 4 === 0){
			img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
				map:THREE.ImageUtils.loadTexture('img/pole.png')
			});

			img.map.needsUpdate = true; //ADDED
			img.transparent = true;

			var pole = new THREE.Mesh(new THREE.PlaneGeometry(12, 200), img);
			scene.add(pole);
			pole.position.set(i*90 - 1410, 0, -40);
		}
	}

	scene.add(passengers.object3D);

	// for (var i = 0; i < 20; i++){
	// 	poles[i] = new Pole(i*750, 100, 150, 675, 0x333333, 1000);
	// 	polesB[i] = new Pole(i*750, 140, -100, 725, 0x121212, 1500);
	// }

	for(var i = 0; i < 6; i++){
		background[i] = new Background(i);
	}

	var geometry = new THREE.PlaneGeometry(20000, 700);
	var material = new THREE.MeshBasicMaterial({ color: 0x111111 });
	var tunnel = new THREE.Mesh( geometry, material );
	scene.add( tunnel );
	tunnel.position.set( 0, 155, -102);

	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function render (timestamp) {
	var delta = timestamp - lastTime;

	controls.update(delta);

	var seconds = timestamp / 1000;

	if(seconds % 1.5 < .025){
		poles.push(new Pole(5200, 140, 150, 725, 0x121212, 1500));
		polesB.push(new Pole(5300, 140, -100, 725, 0x121212, 1500));
	}

	if(poles.length > 22){
		poles.shift();
		polesB.shift();
	}

	for(var i = 0; i < poles.length; i++){ 
		poles[i].setPos(delta, 1.2);
		polesB[i].setPos(delta, 1.2);
	}

	for(var i = 0; i < background.length; i++){
		background[i].setPos(delta);
	}

	passengers.setPos(delta);
	subwayCar.setPos(delta);

	if(audioLoaded == true) updateAudio();

	renderer.render(scene,camera);
	lastTime = timestamp;
}

function animate () {
	requestAnimationFrame( function(timestamp){
		animate();
		render(timestamp);
	});
}
