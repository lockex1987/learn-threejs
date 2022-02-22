import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import * as dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);

        this.cube = this.createCube();
        this.scene.add(this.cube);

        this.render();

        this.controls = {
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0
        };
        this.createControlsGui();
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
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(6, 6, 6);
        const cubeMaterial = new MeshNormalMaterial();
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        return cube;
    }

    createControlsGui() {
        const gui = new dat.GUI();
        gui.add(this.controls, 'rotationX', 0, 360)
            .onChange(value => {
                this.cube.rotation.x = this.convertDegToRad(value);
                this.render();
            });
        gui.add(this.controls, 'rotationY', 0, 360)
            .onChange(value => {
                this.cube.rotation.y = this.convertDegToRad(value);
                this.render();
            });
        gui.add(this.controls, 'rotationZ', 0, 360)
            .onChange(value => {
                this.cube.rotation.z = this.convertDegToRad(value);
                this.render();
            });

        // Vị trí hình lập phương
        const size = 10;
        const cubePositionGui = gui.addFolder('Cube position');
        cubePositionGui.add(this.cube.position, 'x', -size, size)
            .onChange(value => {
                this.render();
            });
        cubePositionGui.add(this.cube.position, 'y', -size, size)
            .onChange(value => {
                this.render();
            });
        cubePositionGui.add(this.cube.position, 'z', -size, size)
            .onChange(value => {
                this.render();
            });
        cubePositionGui.open();
    }

    convertDegToRad(deg) {
        return deg * Math.PI / 180;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
