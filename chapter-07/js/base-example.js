import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    HemisphereLight,
    PointLight,
    DirectionalLight
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


class BaseExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();
        this.createOrbitControls();
        this.handleResize();
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0xFFFFFF);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 25);
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

    createOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
    }

    render() {
        this.orbitControls.update();
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


export default BaseExample;
