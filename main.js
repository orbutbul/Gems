import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WebGL from 'three/addons/capabilities/WebGL.js';

import * as Seed from './Seed.js';

import fragment from './Public/Shaders/a_frag.glsl?raw';
import vertex from './Public/Shaders/a_vert.glsl?raw';

let seed = "bredley";

// Renderer

export const colors = ["red", "orange", "yellow", "green", "blue", "purple", "black", "white"];

console.log(Seed.colorNameChecker(seed));


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Shader Material
const boxMaterial = new THREE.ShaderMaterial({
    transparent: true,

    uniforms: { 
        }
    ,
    vertexShader: vertex,

    fragmentShader: fragment

});

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(214,195,144)");

// Orbit Controls
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 2, 5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const loader = new GLTFLoader();

function gltfModel(obj) {
    obj = 'Public/Models/' + obj;
    loader.load(obj, function (gltf) {
        const loadedobject = gltf.scene;

        loadedobject.traverse((child) => {
            if (child.isMesh) {
                child.material = boxMaterial;
            }
        });

        scene.add(loadedobject);
    });
}

gltfModel('Cube.glb');
// const geometry = new THREE.BoxGeometry( 12, 1, 1 );
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add(cube);

const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(ambientLight, directionalLight);



// Animate Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}




if (WebGL.isWebGLAvailable()) {
    animate();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById('container').appendChild(warning);
}
