import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { Color } from 'three';

console.log("Slay");
let number = "redpurple";
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
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);



// Shader Material
const boxMaterial = new THREE.ShaderMaterial({
    uniforms: { 
        SlayColor: {value: ColorGen(number)},
    }
    ,
    vertexShader:`

    varying vec3 vPos;
    uniform vec3 SlayColor;

    void main() {
        vPos = position;
    
        vec4 result;
    
        result = vec4(position.x, position.y, position.z, 1.0);
        gl_Position = projectionMatrix * modelViewMatrix * result;
    } `,
    fragmentShader:`
    varying vec3 vPos;
    uniform vec3 uPos;
    uniform vec3 SlayColor;

    void main() {
        vec3 pos = vPos + uPos; // Modify the pos variable with uPos
        pos += 1.;
        pos /= 3.;
        gl_FragColor = vec4(pos,1.); 
    }` ,
});

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(214,195,144)");

// Orbit Controls
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(0, 2, 20);
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

gltfModel('Pyramid.glb');

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
