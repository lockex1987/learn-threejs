// https://threejs.org/examples/#webgl_loader_svg

import * as THREE from 'three';
import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { SVGLoader } from 'https://threejs.org/examples/jsm/loaders/SVGLoader.js';


let renderer, scene, camera, gui, guiData;


function init() {
    const container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 200);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.addEventListener('change', render);
    controls.screenSpacePanning = true;

    window.addEventListener('resize', onWindowResize);

    guiData = {
        currentURL: 'https://threejs.org/examples/models/svg/tiger.svg',
        drawFillShapes: true,
        drawStrokes: true,
        fillShapesWireframe: false,
        strokesWireframe: false
    };

    loadSVG(guiData.currentURL);

    createGUI();
}


function createGUI() {
    if (gui) {
        gui.destroy();
    }

    gui = new GUI();

    gui.add(guiData, 'currentURL', {
        Tiger: 'https://threejs.org/examples/models/svg/tiger.svg',
        'Three.js': 'https://threejs.org/examples/models/svg/threejs.svg',
        'Joins and caps': 'https://threejs.org/examples/models/svg/lineJoinsAndCaps.svg',
        Hexagon: 'https://threejs.org/examples/models/svg/hexagon.svg',
        Energy: 'https://threejs.org/examples/models/svg/energy.svg',
        'Test 1': 'https://threejs.org/examples/models/svg/tests/1.svg',
        'Test 2': 'https://threejs.org/examples/models/svg/tests/2.svg',
        'Test 3': 'https://threejs.org/examples/models/svg/tests/3.svg',
        'Test 4': 'https://threejs.org/examples/models/svg/tests/4.svg',
        'Test 5': 'https://threejs.org/examples/models/svg/tests/5.svg',
        'Test 6': 'https://threejs.org/examples/models/svg/tests/6.svg',
        'Test 7': 'https://threejs.org/examples/models/svg/tests/7.svg',
        'Test 8': 'https://threejs.org/examples/models/svg/tests/8.svg',
        'Test 9': 'https://threejs.org/examples/models/svg/tests/9.svg',
        Units: 'https://threejs.org/examples/models/svg/tests/units.svg',
        Ordering: 'https://threejs.org/examples/models/svg/tests/ordering.svg',
        Defs: 'https://threejs.org/examples/models/svg/tests/testDefs/Svg-defs.svg',
        Defs2: 'https://threejs.org/examples/models/svg/tests/testDefs/Svg-defs2.svg',
        Defs3: 'https://threejs.org/examples/models/svg/tests/testDefs/Wave-defs.svg',
        Defs4: 'https://threejs.org/examples/models/svg/tests/testDefs/defs4.svg',
        Defs5: 'https://threejs.org/examples/models/svg/tests/testDefs/defs5.svg',
        'Style CSS inside defs': 'https://threejs.org/examples/models/svg/style-css-inside-defs.svg',
        'Multiple CSS classes': 'https://threejs.org/examples/models/svg/multiple-css-classes.svg',
        'Zero Radius': 'https://threejs.org/examples/models/svg/zero-radius.svg'
    })
        .name('SVG File')
        .onChange(update);

    gui.add(guiData, 'drawStrokes').name('Draw strokes').onChange(update);
    gui.add(guiData, 'drawFillShapes').name('Draw fill shapes').onChange(update);
    gui.add(guiData, 'strokesWireframe').name('Wireframe strokes').onChange(update);
    gui.add(guiData, 'fillShapesWireframe').name('Wireframe fill shapes').onChange(update);

    function update() {
        loadSVG(guiData.currentURL);
    }
}


function loadSVG(url) {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xb0b0b0);

    const helper = new THREE.GridHelper(160, 10);
    helper.rotation.x = Math.PI / 2;
    scene.add(helper);

    const svgLoader = new SVGLoader();
    svgLoader.load(url, svg => {
        const paths = svg.paths;

        const group = new THREE.Group();
        group.scale.multiplyScalar(0.25);
        group.position.x = -70;
        group.position.y = 70;
        group.scale.y *= -1;

        for (let i = 0; i < paths.length; i++) {
            const path = paths[i];

            const fillColor = path.userData.style.fill;
            if (guiData.drawFillShapes
                && fillColor !== undefined
                && fillColor !== 'none') {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setStyle(fillColor).convertSRGBToLinear(),
                    opacity: path.userData.style.fillOpacity,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    wireframe: guiData.fillShapesWireframe
                });

                const shapes = SVGLoader.createShapes(path);
                for (let j = 0; j < shapes.length; j++) {
                    const shape = shapes[j];
                    const geometry = new THREE.ShapeGeometry(shape);
                    const mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                }
            }

            const strokeColor = path.userData.style.stroke;
            if (guiData.drawStrokes
                && strokeColor !== undefined
                && strokeColor !== 'none') {
                const material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setStyle(strokeColor).convertSRGBToLinear(),
                    opacity: path.userData.style.strokeOpacity,
                    transparent: true,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    wireframe: guiData.strokesWireframe
                });

                for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
                    const subPath = path.subPaths[j];
                    const geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style);
                    if (geometry) {
                        const mesh = new THREE.Mesh(geometry, material);
                        group.add(mesh);
                    }
                }
            }
        }

        scene.add(group);
        render();
    });
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function render() {
    renderer.render(scene, camera);
}


init();
