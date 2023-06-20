import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import WebGL from 'three/addons/capabilities/WebGL.js';

import * as Seed from './Seed.js';

import fragment from './Public/Shaders/a_frag.glsl?raw';
import vertex from './Public/Shaders/a_vert.glsl?raw';
let models = [];
document.getElementById("submitBtn").addEventListener("click", function(event) {
    event.preventDefault();  // Prevent the form from being submitted to a server.
  
    // Update the `final` variable with the value from the text input.
    var seed = document.getElementById("seedId").value;  
    console.log(seed)
    // Regenerate the object.
    generateObject(seed);
});


function generateObject(final){
    
    final = Seed.Base36(final);

    for (const model of models) {
        scene.remove(model);
    }

    var gemMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { 
            amtofTex: {value: ((final %3) +1)},
            tex1: { value: Seed.textureInit(final)},
            tex2: { value: Seed.textureInit(final, 1)},
            tex3: { value: Seed.textureInit(final, 3)},
            colorAmt: {value:Seed.digitProduct(final,false)%2},
            col1: {value: Seed.colorgen(final)},
            col2: {value: Seed.colorgen(Seed.lcg(final))},
            col3: {value: Seed.colorgen(Seed.lcg(final/2))}

            }
        ,
        vertexShader: vertex,

        fragmentShader: fragment

    });
    const loader = new GLTFLoader();
    function gltfModel(obj) {
        obj = 'Public/Models/' + obj + '.glb';
        loader.load(obj, function(gltf) {
            const loadedobject = gltf.scene;

            loadedobject.traverse((child) => {
                if (child.isMesh) {
                    child.material = gemMaterial;
                }
            });
            models.push(loadedobject)
            scene.add(loadedobject);
        });
    }
    gltfModel(Seed.geo(final));

}


const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const scene = new THREE.Scene();
scene.background = new THREE.Color("rgb(214,195,144)");

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .01, 30);
camera.position.set(0, 2, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

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

