import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WebGL from 'three/addons/capabilities/WebGL.js';

import fragment from './Public/Shaders/a_frag.glsl?raw'
import vertex from './Public/Shaders/a_vert.glsl?raw'


console.log("Slay");
let number = "Mama";
number = number.toLowerCase();

const colors = ["red","orange","yellow","green","blue","purple","black","white"]


function colorNameChecker (seed){
    colors.forEach(function(color){
        if (seed.includes(color)){
            console.log(color);
        }
    })
}
colorNameChecker(number);

function returnColorComp(component,start,end){
    component= parseInt(component.substring(start,end));
    component = (component % 255);
    if (component <= 40){
        component *= 1.5;
    }
    return (component/255);
}


function ColorGen(number){
    number = parseInt(number,36);
    number = number.toString();
    let red = returnColorComp(number,0,2);
    let green = returnColorComp(number,3,5);
    let blue = returnColorComp(number,6,8);
    const GeoColor = new THREE.Color(red,green,blue);
    return(GeoColor);
}

console.log(ColorGen(number));

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// Shader Material
const boxMaterial = new THREE.ShaderMaterial({

    uniforms: { 
        SlayColor: {value: ColorGen(number)},
    }
    ,
    vertexShader: vertex,
    // `

    // varying vec3 vPos;
    // uniform vec3 SlayColor;

    // void main() {
    //     vPos = position;
    
    //     vec4 result;
    
    //     result = vec4(position.x, position.y, position.z, 1.0);
    //     gl_Position = projectionMatrix * modelViewMatrix * result;
    // } `,
    fragmentShader: fragment
    // `
    // varying vec3 vPos;
    // uniform vec3 uPos;
    // uniform vec3 SlayColor;

    // const float PHI = 1.61803398874989484820459; // Φ = Golden Ratio 

    // float gold_noise(in vec3 xyz)
    // {
    //     return fract(tan(distance(xyz*PHI, xyz)*1938324.)*xyz.x);
    // }

    // void main() {
    //     vec3 pos = vPos + uPos; // Modify the pos variable with uPos
    //     pos += 1.;
    //     pos /= 2.;
    //     pos *= 4.;
    //     vec3 girdPos = fract(pos);
    //     vec3 gridPosId = floor(pos);
    //     gridPosId *= .25;
    //     float slay = gold_noise(pos);
    //     gl_FragColor = vec4(gridPosId,1.); 
    // }` ,
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

gltfModel('cube.glb');
const geometry = new THREE.BoxGeometry( 12, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );



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
