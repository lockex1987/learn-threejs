// https://threejs.org/examples/#webgl_lights_physical

import * as THREE from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import Stats from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/stats.module.js';
import { GUI } from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


let camera, scene, renderer, bulbLight, bulbMaterial, hemiLight, stats;
let ballMaterial, cubeMaterial, floorMaterial;
let previousShadowMap = false;

// ref for lumens: http://www.power-sure.com/lumens.htm
const bulbLuminousPowers = {
    '110000 lm (1000W)': 110000,
    '3500 lm (300W)': 3500,
    '1700 lm (100W)': 1700,
    '800 lm (60W)': 800,
    '400 lm (40W)': 400,
    '180 lm (25W)': 180,
    '20 lm (4W)': 20,
    Off: 0
};

// ref for solar irradiances: https://en.wikipedia.org/wiki/Lux
const hemiLuminousIrradiances = {
    '0.0001 lx (Moonless Night)': 0.0001,
    '0.002 lx (Night Airglow)': 0.002,
    '0.5 lx (Full Moon)': 0.5,
    '3.4 lx (City Twilight)': 3.4,
    '50 lx (Living Room)': 50,
    '100 lx (Very Overcast)': 100,
    '350 lx (Office Room)': 350,
    '400 lx (Sunrise/Sunset)': 400,
    '1000 lx (Overcast)': 1000,
    '18000 lx (Daylight)': 18000,
    '50000 lx (Direct Sun)': 50000
};

const params = {
    shadows: true,
    exposure: 0.68,
    bulbPower: Object.keys(bulbLuminousPowers)[4],
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[0]
};


function init() {
    stats = new Stats();
    document.body.appendChild(stats.dom);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.x = -4;
    camera.position.z = 4;
    camera.position.y = 2;

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webglOutput')
    });
    renderer.physicallyCorrectLights = true;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

    bulbMaterial = new THREE.MeshStandardMaterial({
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMaterial));
    bulbLight.position.set(0, 2, 0);
    bulbLight.castShadow = true;
    scene.add(bulbLight);

    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemiLight);

    floorMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.8,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 0.0005
    });
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg', map => {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        map.encoding = THREE.sRGBEncoding;
        floorMaterial.map = map;
        floorMaterial.needsUpdate = true;
    });
    textureLoader.load('https://threejs.org/examples/textures/hardwood2_bump.jpg', map => {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMaterial.bumpMap = map;
        floorMaterial.needsUpdate = true;
    });
    textureLoader.load('https://threejs.org/examples/textures/hardwood2_roughness.jpg', map => {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMaterial.roughnessMap = map;
        floorMaterial.needsUpdate = true;
    });

    cubeMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.7,
        color: 0xffffff,
        bumpScale: 0.002,
        metalness: 0.2
    });
    textureLoader.load('https://threejs.org/examples/textures/brick_diffuse.jpg', map => {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(1, 1);
        map.encoding = THREE.sRGBEncoding;
        cubeMaterial.map = map;
        cubeMaterial.needsUpdate = true;
    });
    textureLoader.load('https://threejs.org/examples/textures/brick_bump.jpg', map => {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(1, 1);
        cubeMaterial.bumpMap = map;
        cubeMaterial.needsUpdate = true;
    });

    ballMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 1.0
    });
    textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg', map => {
        map.anisotropy = 4;
        map.encoding = THREE.sRGBEncoding;
        ballMaterial.map = map;
        ballMaterial.needsUpdate = true;
    });
    textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg', map => {
        map.anisotropy = 4;
        map.encoding = THREE.sRGBEncoding;
        ballMaterial.metalnessMap = map;
        ballMaterial.needsUpdate = true;
    });

    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.receiveShadow = true;
    floorMesh.rotation.x = -Math.PI / 2.0;
    scene.add(floorMesh);

    const ballGeometry = new THREE.SphereGeometry(0.25, 32, 32);
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    ballMesh.position.set(1, 0.25, 1);
    ballMesh.rotation.y = Math.PI;
    ballMesh.castShadow = true;
    scene.add(ballMesh);

    const boxGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);

    const boxMesh1 = new THREE.Mesh(boxGeometry, cubeMaterial);
    boxMesh1.position.set(-0.5, 0.25, -1);
    boxMesh1.castShadow = true;
    scene.add(boxMesh1);

    const boxMesh2 = new THREE.Mesh(boxGeometry, cubeMaterial);
    boxMesh2.position.set(0, 0.25, -5);
    boxMesh2.castShadow = true;
    scene.add(boxMesh2);

    const boxMesh3 = new THREE.Mesh(boxGeometry, cubeMaterial);
    boxMesh3.position.set(7, 0.25, 0);
    boxMesh3.castShadow = true;
    scene.add(boxMesh3);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1;
    controls.maxDistance = 20;

    window.addEventListener('resize', onWindowResize);

    const gui = new GUI();
    gui.add(params, 'hemiIrradiance', Object.keys(hemiLuminousIrradiances));
    gui.add(params, 'bulbPower', Object.keys(bulbLuminousPowers));
    gui.add(params, 'exposure', 0, 1);
    gui.add(params, 'shadows');
    gui.open();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function update() {
    const time = Date.now() * 0.0005;

    renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes.
    renderer.shadowMap.enabled = params.shadows;
    bulbLight.castShadow = params.shadows;

    if (params.shadows !== previousShadowMap) {
        ballMaterial.needsUpdate = true;
        cubeMaterial.needsUpdate = true;
        floorMaterial.needsUpdate = true;
        previousShadowMap = params.shadows;
    }

    bulbLight.power = bulbLuminousPowers[params.bulbPower];
    bulbMaterial.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface
    hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
    bulbLight.position.y = Math.cos(time) * 0.75 + 1.25;
}


function render() {
    stats.update();
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


init();
render();
