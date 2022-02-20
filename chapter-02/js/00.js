import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh,
    AxesHelper
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import * as dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);
        const cube = this.createCube();
        this.scene.add(cube);
        requestAnimationFrame(this.render.bind(this));
        this.handleResize();

        this.controls = this.createControls(this.scene, this.createCube);
        this.createControlsGui();

        const axesHelper = new AxesHelper(15);
        this.scene.add(axesHelper);
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
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

    createCube() {
        const cubeSize = Math.ceil((Math.random() * 3));
        const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new MeshNormalMaterial();
        const cube = new Mesh(cubeGeometry, cubeMaterial);

        // Position the cube randomly in the scene
        cube.position.x = -15 + Math.round((Math.random() * 30));
        cube.position.y = Math.round((Math.random() * 5));
        cube.position.z = -10 + Math.round((Math.random() * 20));

        cube.tick = ms => {
            cube.rotation.y = ms * Math.PI / 1000;
        };

        return cube;
    }

    createControls(scene, createCubeFunc) {
        // Chú ý đối tượng this ở đây
        const controls = {
            numberOfObjects: scene.children.length,

            removeCube() {
                const allObjects = scene.children;
                const lastObject = allObjects[allObjects.length - 1];
                if (lastObject instanceof Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            },

            addCube() {
                const cube = createCubeFunc();
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            }
        };
        return controls;
    }

    createControlsGui() {
        const gui = new dat.GUI();
        gui.add(this.controls, 'addCube');
        gui.add(this.controls, 'removeCube');
        gui.add(this.controls, 'numberOfObjects').listen();
    }

    update(ms) {
        this.scene.traverse(obj => {
            if (obj instanceof Mesh) {
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
