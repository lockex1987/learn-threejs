import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    HemisphereLight,
    PointLight,
    DirectionalLight,
    ExtrudeGeometry,
    MeshStandardMaterial,
    Mesh,
    Group
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/lil-gui.module.min.js';
import transformSVGPath from '../../js/d3-threeD.js';


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();
        this.createSvg();
        this.createOrbitControls();
        // this.createControlsGui();
        this.handleResize();
        requestAnimationFrame(this.render.bind(this));
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

    parseSvg(svgString, scale, svgMaterial) {
        const path = transformSVGPath(svgString);
        const shapes = path.toShapes(true);
        const group = new Group();
        shapes.forEach(shape => {
            const options = {
                depth: 2,
                bevelThickness: 2,
                bevelSize: 0.5,
                bevelSegments: 3,
                bevelEnabled: true,
                curveSegments: 12,
                steps: 1
            };
            const svgGeometry = new ExtrudeGeometry(shape, options);
            svgGeometry.scale(scale, scale, scale);
            svgGeometry.center();

            const mesh = new Mesh(svgGeometry, svgMaterial);
            group.add(mesh);
        });
        return group;
    }

    createSvg() {
        const svgString = document.querySelector('#batman-path').getAttribute('d');
        const scale = 0.001;
        const svgMaterial = new MeshStandardMaterial({
            color: 0x156289,
            emissive: 0x072534,
            roughness: 0
        });
        this.svgMesh = this.parseSvg(svgString, scale, svgMaterial);
        this.svgMesh.tick = ms => {
            this.svgMesh.rotation.y = (ms / 1000) * Math.PI * 0.05;
        };
        this.scene.add(this.svgMesh);
    }

    createOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;

        // Khóa góc xoay theo chiều dọc
        // Chỉ xoay được theo trục Y
        this.orbitControls.minPolarAngle = Math.PI / 2;
        this.orbitControls.maxPolarAngle = Math.PI / 2;
    }

    // TODO: Chưa dùng
    createControlsGui() {
        const reloadTextGeometry = () => {
            const textGeometry = this.createTextGeometry();
            this.svgMesh.geometry.dispose();
            this.svgMesh.geometry = textGeometry;
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
                this.scene.remove(this.svgMesh);
                this.createSvg();
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
        this.svgMesh.tick(ms);
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
