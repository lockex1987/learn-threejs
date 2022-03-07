// https://threejs.org/examples/#webgl_lights_rectarealight

import * as THREE from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'https://unpkg.com/three@0.137.5/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@0.137.5/examples/jsm/lights/RectAreaLightUniformsLib.js';


let scene, camera, renderer;
let stats;


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 5, -15);

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webglOutput'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setAnimationLoop(render); // ?
    renderer.outputEncoding = THREE.sRGBEncoding; // ?

    RectAreaLightUniformsLib.init(); // ?

    const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10);
    rectLight1.position.set(-5, 5, 5);
    scene.add(rectLight1);

    const rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 4, 10);
    rectLight2.position.set(0, 5, 5);
    scene.add(rectLight2);

    const rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 4, 10);
    rectLight3.position.set(5, 5, 5);
    scene.add(rectLight3);

    scene.add(new RectAreaLightHelper(rectLight1));
    scene.add(new RectAreaLightHelper(rectLight2));
    scene.add(new RectAreaLightHelper(rectLight3));

    const floorGeometry = new THREE.BoxGeometry(2000, 0.1, 2000);
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.1,
        metalness: 0
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floorMesh);

    const knotGeometry = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16);
    const knotMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0,
        metalness: 0
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    knotMesh.name = 'knotMesh';
    knotMesh.position.set(0, 5, 0);
    scene.add(knotMesh);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(knotMesh.position);
    controls.update();

    window.addEventListener('resize', onWindowResize);

    stats = new Stats();
    document.body.appendChild(stats.dom);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function render(time) {
    stats.update();

    const knotMesh = scene.getObjectByName('knotMesh');
    knotMesh.rotation.y = time / 1000;

    renderer.render(scene, camera);
}


init();
