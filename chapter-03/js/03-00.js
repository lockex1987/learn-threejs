import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    TorusGeometry,
    PlaneGeometry,
    MeshNormalMaterial,
    MeshBasicMaterial,
    MeshDepthMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import * as dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.scene.overrideMaterial = new MeshDepthMaterial();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);

        this.plane = this.createPlane();
        this.scene.add(this.plane);

        const numberOfTorus = 10;
        for (let i = 0; i < numberOfTorus; i++) {
            const torus = this.createTorus();
            this.scene.add(torus);
        }

        requestAnimationFrame(this.render.bind(this));
        this.handleResize();

        this.controls = this.createControls(this.scene, this.createTorus);
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
        const camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.set(-30, 40, 30);
        camera.lookAt(this.scene.position);

        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        renderer.setClearColor(new Color(0x000000));
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        renderer.setSize(width, height, false);
        return renderer;
    }

    createTorus() {
        const scale = 0.2 + (Math.random() - 0.5) * 0.1;
        const torusGeometry = new TorusGeometry(10, 3, 16, 100);

        // const torusMaterial = new MeshNormalMaterial();
        const torusMaterial = new MeshDepthMaterial();
        const torus = new Mesh(torusGeometry, torusMaterial);

        // Thiết lập vị trí ngẫu nhiên
        torus.position.x = -15 + Math.round((Math.random() * 30));
        torus.position.y = 5 + Math.round((Math.random() * 5));
        torus.position.z = -10 + Math.round((Math.random() * 20));
        torus.scale.set(scale, scale, scale);

        torus.castShadow = true;

        torus.tick = ms => {
            torus.rotation.y = ms * Math.PI / 1000;
        };

        return torus;
    }

    createPlane() {
        const planeGeometry = new PlaneGeometry(30, 20, 1, 1);
        const planeMaterial = new MeshBasicMaterial({
            // color: 0xDDDDDDD
            color: new Color('rgb(106, 193, 116)')
        });

        planeMaterial.opacity = 0.4; // không ăn, phải thêm transparent bằng true
        planeMaterial.transparent = true;

        const planeMesh = new Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -0.5 * Math.PI;
        planeMesh.position.x = 0;
        planeMesh.position.y = -1;
        planeMesh.position.z = 0;
        return planeMesh;
    }

    createControls() {
        const controls = {};
        return controls;
    }

    createControlsGui() {
        const gui = new dat.GUI();

        // Camera
        const size = 100;
        const cameraPositionGui = gui.addFolder('Camera position');
        cameraPositionGui.add(this.camera.position, 'x', -size, size);
        cameraPositionGui.add(this.camera.position, 'y', -size, size);
        cameraPositionGui.add(this.camera.position, 'z', -size, size);
        cameraPositionGui.open();

        const cameraProjectionGui = gui.addFolder('Camera projection');
        cameraProjectionGui.add(this.camera, 'fov', 0, 100)
            .onChange(value => {
                this.camera.updateProjectionMatrix();
            });
        cameraProjectionGui.open();
    }

    update(ms) {
        this.scene.traverse(obj => {
            if (obj instanceof Mesh && obj != this.plane) {
                obj.tick(ms);
            }
        });
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
