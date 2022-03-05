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
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);
        const cube = this.createCube();
        this.scene.add(cube);
        this.createControls();
        requestAnimationFrame(this.render.bind(this));
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
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
        renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
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

        // TrackballControls không thể sử dụng kỹ thuật render theo yêu cầu
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

    onResize() {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();

        const pixelRatio = window.devicePixelRatio;
        this.renderer.setSize(width * pixelRatio, height * pixelRatio, false);

        // Gọi khi resize
        this.trackballControls.handleResize();
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
