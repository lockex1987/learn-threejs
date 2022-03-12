import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    MeshStandardMaterial,
    Mesh,
    HemisphereLight,
    PointLight,
    DirectionalLight
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/lil-gui.module.min.js';
import { FontLoader, Font } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/FontLoader.js';
import { TTFLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/TTFLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.137.5/examples/jsm/geometries/TextGeometry.js';


/**
 * Promisify font loading.
 */
function loadFontAsync(fontName, fontWeight) {
    const url = 'https://threejs.org/examples/fonts/' + fontName + '_' + fontWeight + '.typeface.json';
    const fontLoader = new FontLoader();
    return new Promise((resolve, reject) => {
        fontLoader.load(url, resolve, undefined, reject);
    });
}


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();

        this.textMaterial = new MeshStandardMaterial({
            color: 0x156289,
            // color: 0xd63384,
            // color: 0x20c997,
            emissive: 0x072534,
            roughness: 0
        });

        this.controls = {
            text: 'Tiếng Việt', // Hello Three.js!
            font: 'but_long'
        };
        this.parameters = {
            size: 0.25,
            height: 0.05,
            curveSegments: 6,
            bevelEnabled: false,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 4
        };

        this.fontMap = {
            helvetiker: null,
            gentilis: null,
            optimer: null,
            droid_sans: null,
            droid_serif: null,
            roboto: null,
            but_long: null
        };
        this.loadFont();
        this.loadTtf();
        this.loadMultipleFonts();

        this.createOrbitControls();
        this.createControlsGui();
        this.handleResize();
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0xFFFFFF);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 15);
        this.camera.position.z = 2;
    }

    createRenderer(canvas) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const pixelRatio = window.devicePixelRatio;
        this.renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
    }

    createLights() {
        const hemisphereLight = new HemisphereLight(0xffffff, 0xaaaaaa, 0.5);
        this.scene.add(hemisphereLight);

        const directionalLight = new DirectionalLight(0xeeeeee, 0.5);
        directionalLight.position.set(0, 2, 5);
        this.scene.add(directionalLight);

        const pointLight = new PointLight(0xffffff, 0.5);
        pointLight.position.set(0, 0.05, 2);
        this.scene.add(pointLight);
    }

    loadFont() {
        const fontLoader = new FontLoader();
        // const url = 'https://threejs.org/examples/fonts/optimer_regular.typeface.json';
        // const url = '../fonts/roboto/roboto_regular_all.typeface.json';
        // const url = '../fonts/roboto/roboto_regular_some.typeface.json';
        const url = '../fonts/but_long/but_long_regular.typeface.json';
        const onLoaded = font => {
            // console.log(font);
            // console.log(font.data.glyphs);
            this.font = font;
            // this.fontMap.roboto = this.font;
            this.fontMap.but_long = this.font;
            this.createText();
        };
        const onProgress = xhr => {
            // console.log(xhr.loaded, xhr.total, (xhr.loaded / xhr.total * 100) + '% loaded');
        };
        fontLoader.load(url, onLoaded, onProgress);
    }

    async loadMultipleFonts() {
        this.fontMap.gentilis = await loadFontAsync('gentilis', 'bold');
        this.fontMap.helvetiker = await loadFontAsync('helvetiker', 'bold');
        this.fontMap.optimer = await loadFontAsync('optimer', 'bold');
        this.fontMap.droid_sans = await loadFontAsync('droid/droid_sans', 'bold');
        this.fontMap.droid_serif = await loadFontAsync('droid/droid_serif', 'bold');
    }

    loadTtf() {
        const url = '../fonts/roboto/roboto-regular.ttf';
        const onLoaded = ttf => {
            // this.font = new Font(ttf);
            this.fontMap.roboto = this.font;
            // this.createText();
        };
        const ttfLoader = new TTFLoader();
        ttfLoader.load(url, onLoaded);
    }

    createTextGeometry() {
        const text = this.controls.text;
        const parameters = {
            font: this.font,
            ...this.parameters
        };
        const textGeometry = new TextGeometry(text, parameters);
        textGeometry.center();
        return textGeometry;
    }

    createText() {
        const textGeometry = this.createTextGeometry();
        // this.textMesh = new Mesh(textGeometry, this.textMaterial);
        this.textMesh = new Mesh(textGeometry, [
            this.textMaterial, // front
            new MeshStandardMaterial({
                color: 0xffc107,
                // emissive: 0xffc107,
                emissive: 0x444444,
                roughness: 0
            }) // side
        ]);
        this.textMesh.tick = ms => {
            this.textMesh.rotation.y = (ms / 1000) * Math.PI * 0.05;
        };
        this.scene.add(this.textMesh);

        requestAnimationFrame(this.render.bind(this));
    }

    createOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;

        // Khóa góc xoay theo chiều ngang
        // Không thể xoay theo trục Y
        // this.orbitControls.minAzimuthAngle = Math.PI;
        // this.orbitControls.maxAzimuthAngle = Math.PI;

        // Khóa góc xoay theo chiều dọc
        // Chỉ xoay được theo trục Y
        this.orbitControls.minPolarAngle = Math.PI / 2;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
    }

    createControlsGui() {
        const reloadTextGeometry = () => {
            const textGeometry = this.createTextGeometry();
            this.textMesh.geometry.dispose();
            this.textMesh.geometry = textGeometry;
        };

        const gui = new GUI();
        gui.add(this.textMaterial, 'wireframe');
        gui.add(this.controls, 'text').onChange(reloadTextGeometry);
        const fonts = [
            'gentilis',
            'helvetiker',
            'optimer',
            'droid_sans',
            'droid_serif',
            'roboto',
            'but_long'
        ];
        gui.add(this.controls, 'font', fonts)
            .onChange(fontName => {
                this.font = this.fontMap[fontName];
                this.scene.remove(this.textMesh);
                this.createText();
            });

        gui.add(this.parameters, 'size', 0, 0.5, 0.01).onChange(reloadTextGeometry);
        gui.add(this.parameters, 'height', 0, 0.3, 0.01).onChange(reloadTextGeometry);
        gui.add(this.parameters, 'curveSegments', 1, 10, 1).onChange(reloadTextGeometry);
        gui.add(this.parameters, 'bevelEnabled').onChange(reloadTextGeometry);
        gui.add(this.parameters, 'bevelThickness', 0.0, 0.2).onChange(reloadTextGeometry);
        gui.add(this.parameters, 'bevelSize', 0, 0.05).onChange(reloadTextGeometry);
        gui.add(this.parameters, 'bevelOffset', -0.02, 0.02).onChange(reloadTextGeometry);
        gui.add(this.parameters, 'bevelSegments', 1, 5, 1).onChange(reloadTextGeometry);
    }

    update(ms) {
        this.textMesh.tick(ms);
    }

    render(ms) {
        this.orbitControls.update();
        this.update(ms);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    onResize() {
        const canvas = this.renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));

