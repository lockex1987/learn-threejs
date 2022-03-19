import * as THREE from 'three';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://threejs.org/examples/jsm/loaders/RGBELoader.js';


let scene, camera, renderer;


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.set(-1.8, 0.6, 2.7);

    new RGBELoader()
        .setPath('https://threejs.org/examples/textures/equirectangular/')
        .load('royal_esplanade_1k.hdr', texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
            render();

            const loader = new GLTFLoader()
                .setPath('https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/');
            loader.load('DamagedHelmet.gltf', gltf => {
                scene.add(gltf.scene);
                render();
            });
        });

    renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webglOutput'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render); // use if there is no animation loop
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, -0.2);
    controls.update();

    window.addEventListener('resize', onWindowResize);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}


function render() {
    renderer.render(scene, camera);
}


init();
render();
