// https://simonharris.co/shader-tutorial-for-glsl-in-opengl-using-threejs/

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    Mesh,
    ShaderMaterial
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


const myCanvas = document.getElementById('webglOutput');

const scene = new Scene();

const camera = new PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.01,
    1000000
);
camera.position.set(0, 0, -30);

const renderer = new WebGLRenderer({
    canvas: myCanvas,
    alpha: true
});
renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const material = new ShaderMaterial({
    vertexShader: document.getElementById('vertexShader2').textContent,
    fragmentShader: document.getElementById('fragmentShader2').textContent
});
material.transparent = true;

const geometry = new SphereGeometry(5, 32, 32);
const mesh = new Mesh(geometry, material);
mesh.position.set(0, 0, 10);
scene.add(mesh);

const controls = new OrbitControls(camera, renderer.domElement);

function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();
