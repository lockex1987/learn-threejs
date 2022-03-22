import * as THREE from 'three';
import { GLTFLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, orbitControls;
let model;


function init() {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(600, 20, -200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemisphereLight.position.set(0, 20, 0); // ?
    scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight('#0C0C0C');
    scene.add(ambientLight);

    const grid = new THREE.GridHelper(1000, 100, 0x000000, 0x000000);
    grid.material.opacity = 0.1;
    grid.material.transparent = true;
    grid.position.set(0, -240, 0);
    scene.add(grid);

    const loader = new GLTFLoader();
    loader.load('../models/discobolus.gltf', object => {
        object.scene.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.metalness = 0.5;
                child.material.roughness = 0;
                child.material.color = new THREE.Color(0xFFFFFF * Math.random());
            }
        });
        object.scene.rotation.y = Math.PI / 2;
        object.scene.position.set(0, -240, 0);
        object.scene.scale.set(0.33, 0.33, 0.33);
        model = object.scene;
        scene.add(object.scene);
    });

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: document.querySelector('#webglOutput')
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearAlpha(0);
    renderer.shadowMap.enabled = true;

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.enableZoom = false;

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}


function render() {
    orbitControls.update();
    if (model) {
        model.rotation.y -= 0.015;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function handleClick() {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            const obj = intersects[0].object;
            obj.material.color = new THREE.Color('#'.concat(Math.random().toString(16).slice(-6)));
            obj.material.metalness = Math.random();
            obj.material.roughness = Math.random();
        }
    }


    window.addEventListener('click', onMouseClick);
}


init();
render();
handleClick();
