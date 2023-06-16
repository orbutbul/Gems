import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WebGL from 'three/addons/capabilities/WebGL.js';

import * as Seed from './Seed.js';

import fragment from './Public/Shaders/a_frag.glsl?raw';
import vertex from './Public/Shaders/a_vert.glsl?raw';

let final = "zzzzzzzzzz";
console.log(final);
final = Seed.Base36(final);
console.log(Seed.gemInit(final));


const col = Seed.colorgen(final);

const colorie = new THREE.Color(col[0],col[1],col[2]);




const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(214,195,144)");

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 2, 5);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const gemMaterial = new THREE.ShaderMaterial({
    transparent: true,

    uniforms: { 
        Colorie : {value: colorie},
        }
    ,
    vertexShader: vertex,

    fragmentShader: fragment

});

const loader = new GLTFLoader();
function gltfModel(obj) {
    obj = 'Public/Models/' + obj + '.glb';
    loader.load(obj, function (gltf) {
        const loadedobject = gltf.scene;

        loadedobject.traverse((child) => {
            if (child.isMesh) {
                child.material = gemMaterial;
            }
        });

        scene.add(loadedobject);
    });
}

gltfModel(Seed.geo(final));


const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(ambientLight, directionalLight);




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
