import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);
        const cube = this.createCube();
        this.scene.add(cube);
        this.createControls();
        this.createControlsGui();
        requestAnimationFrame(this.render.bind(this));
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new PerspectiveCamera(45, aspect, 1, 5);
        camera.position.z = 2;
        camera.lookAt(this.scene.position);
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const pixelRatio = window.devicePixelRatio;
        renderer.setClearColor(new Color(0xFFFFFF));
        renderer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio, false);
        return renderer;
    }

    createCube() {
        const size = 0.5;
        const cubeGeometry = new BoxGeometry(size, size, size);
        const cubeMaterial = new MeshNormalMaterial();
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        return cube;
    }

    createControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
        this.orbitControls.autoRotate = false;

        this.orbitControls.addEventListener('change', () => {
            if (!this.controls.useAnimationLoop) {
                this.renderer.render(this.scene, this.camera);
            }
        });
    }

    createControlsGui() {
        this.controls = {
            useAnimationLoop: true
        };

        const gui = new GUI();
        gui.add(this.controls, 'useAnimationLoop');
        gui.add(this.orbitControls, 'enableDamping');
        gui.add(this.orbitControls, 'autoRotate');
    }

    render() {
        // OrbitControls nếu có enableDamping hoặc autoRotate thì phải update ở đây
        if (this.orbitControls.enableDamping || this.orbitControls.autoRotate) {
            this.orbitControls.update();
        }

        if (this.controls.useAnimationLoop) {
            this.renderer.render(this.scene, this.camera);
        }

        requestAnimationFrame(this.render.bind(this));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
