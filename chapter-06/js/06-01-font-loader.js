import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/TTFLoader.js';


let scene, camera, renderer;


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, -400, 600);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const fontLoader = new FontLoader();
    const fontUrl = '../fonts/helvetiker/helvetiker_regular.typeface.json';
    const ttfFontUrl = '../fonts/roboto/roboto-regular.ttf';

    const loader = new TTFLoader();
    const fontLoader1 = new FontLoader();
    loader.load(ttfFontUrl, ttf => {
        // console.log(ttf);
        const font = fontLoader1.parse(ttf);
        // console.log(font);
        createText(font);
    });

    fontLoader.load(fontUrl, font => {
        // console.log(font);
        // createText(font);
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.addEventListener('change', render);

    window.addEventListener('resize', onWindowResize);
}


function createText(font) {
    const color = 0x006699;
    const matDark = new THREE.LineBasicMaterial({
        color: color,
        side: THREE.DoubleSide
    });
    const matLite = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
    });

    const message = '  Three.js\nTiếng Việt';
    const shapes = font.generateShapes(message, 100);
    const geometry = new THREE.ShapeGeometry(shapes);
    geometry.computeBoundingBox();
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
    geometry.translate(xMid, 0, 0);

    // make shape ( N.B. edge view not visible )

    const text = new THREE.Mesh(geometry, matLite);
    text.position.z = -150;
    scene.add(text);

    // make line shape ( N.B. edge view remains visible )

    const holeShapes = [];

    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        if (shape.holes && shape.holes.length > 0) {
            for (let j = 0; j < shape.holes.length; j++) {
                const hole = shape.holes[j];
                holeShapes.push(hole);
            }
        }
    }

    shapes.push.apply(shapes, holeShapes);

    const lineText = new THREE.Object3D();

    for (let i = 0; i < shapes.length; i++) {
        const shape = shapes[i];
        const points = shape.getPoints();
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        geometry.translate(xMid, 0, 0);
        const lineMesh = new THREE.Line(geometry, matDark);
        lineText.add(lineMesh);
    }

    scene.add(lineText);

    render();
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
