import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';



let number = "zzzzzzzzzzzz";
let b36Num= parseInt(number,36);
console.log(b36Num);
//Renderer

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//Shader Material 

const boxMaterial = new THREE.ShaderMaterial({
	// wireframe: true,	
	vertexShader: `
      void main()	{
        vec4 result;
        result = vec4(position.x, position.y, position.z, 1.0);
        gl_Position = projectionMatrix
          * modelViewMatrix
          * result;
      }
      `,

	fragmentShader: `
       void main() {
         gl_FragColor = vec4(.5, 0.5, 0.0, 1.0);
       }
       `,
});

//scene

const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(214,195,144)");


//Orbit Controls

// const boxMaterial = new THREE.MeshPhongMaterial({
// 	color: 0xff0000,
// } );


//Camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 0, 10, 50 );
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// const box = new THREE.BoxGeometry(1,1,1,1,1,1);
// const boxmesh = new THREE.Mesh(box,boxMaterial);
// scene.add(boxmesh);

const loader = new GLTFLoader();

function gltfModel(path){
	path = 'Public/Models/' + path;
	loader.load(path, function (gltf) {
		const loadedobject = gltf.scene;

		loadedobject.traverse((child) => {

			if (child.isMesh) {
				child.material = boxMaterial;
			}
		});


		scene.add(loadedobject);
	})

}
gltfModel('Sq antiprism.glb');


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(ambientLight, directionalLight);
//Animate Loop

function animate() {

	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );

}

//Animate Call 
animate();