import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { TrackballControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/TrackballControls.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);
        const cube = this.createCube();
        this.scene.add(cube);
        this.createControls();
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
        renderer.setClearColor(new Color(0x000000));
        renderer.setSize(window.innerWidth * pixelRatio, window.innerHeight * pixelRatio);
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
        this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);

        this.trackballControls.rotateSpeed = 3;
        this.trackballControls.zoomSpeed = 1.2;
        this.trackballControls.panSpeed = 0.8;

        // TrackballControls không làm thế này được
        /*
        this.trackballControls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
        });
        */
    }

    render() {
        // TrackballControls luôn phải gọi
        this.trackballControls.update();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    onWindowResize() {
        const aspect = window.innerWidth / window.innerHeight;

        perspectiveCamera.aspect = aspect;
        perspectiveCamera.updateProjectionMatrix();

        orthographicCamera.left = -frustumSize * aspect / 2;
        orthographicCamera.right = frustumSize * aspect / 2;
        orthographicCamera.top = frustumSize / 2;
        orthographicCamera.bottom = -frustumSize / 2;
        orthographicCamera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

        controls.handleResize();
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
