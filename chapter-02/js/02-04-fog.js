import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshBasicMaterial,
    MeshNormalMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    Mesh,
    Fog,
    DirectionalLight
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { GUI } from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';


// We use this class to pass to lil-gui
// so when it manipulates near or far
// near is never > far and far is never < near
// Also when lil-gui maniplates color we'll
// update both the fog and background colors.
class FogGUIHelper {
    constructor(fog, backgroundColor) {
        this.fog = fog;
        this.backgroundColor = backgroundColor;
    }

    get near() {
        return this.fog.near;
    }

    set near(v) {
        this.fog.near = v;
        this.fog.far = Math.max(this.fog.far, v);
    }

    get far() {
        return this.fog.far;
    }

    set far(v) {
        this.fog.far = v;
        this.fog.near = Math.min(this.fog.near, v);
    }

    get color() {
        return `#${this.fog.color.getHexString()}`;
    }

    set color(hexString) {
        this.fog.color.set(hexString);
        this.backgroundColor.set(hexString);
    }
}


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);
        this.cube = this.createCube();
        this.scene.add(this.cube);
        // this.addLights();
        requestAnimationFrame(this.render.bind(this));
        this.handleResize();
        this.createControlsGui();
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;
        const camera = new PerspectiveCamera(75, aspect, 1, 5);
        camera.position.z = 2;
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        renderer.setSize(width, height, false);
        return renderer;
    }

    createCube() {
        const geometry = new BoxGeometry(1, 1, 1);
        const color = 0x44aa88;
        const material = new MeshBasicMaterial({ color });
        // const material = new MeshNormalMaterial();
        // const material = new MeshLambertMaterial({ color });
        // const material = new MeshPhongMaterial({ color });
        const cube = new Mesh(geometry, material);
        cube.tick = ms => {
            const rot = (ms / 1000) * (Math.PI / 4);
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        };
        return cube;
    }

    addLights() {
        const light = new DirectionalLight(0xFFFFFF, 1);
        light.position.set(-1, 2, 4);
        this.scene.add(light);
    }

    createControlsGui() {
        const near = 1;
        const far = 2;
        const color = '#add8e6';
        this.scene.fog = new Fog(color, near, far);
        this.scene.background = new Color(color);
        // this.renderer.setClearColor(new Color(color));

        const gui = new GUI();
        const fogGuiHelper = new FogGUIHelper(this.scene.fog, this.scene.background);
        gui.add(fogGuiHelper, 'near', near, far)
            .listen();
        gui.add(fogGuiHelper, 'far', near, far)
            .listen();
        gui.addColor(fogGuiHelper, 'color');
    }

    update(ms) {
        this.cube.tick(ms);
    }

    render(ms) {
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
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        const aspect = width / height;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
