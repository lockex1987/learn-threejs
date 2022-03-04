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
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        // this.orbitControls.enableDamping = true;
        // this.orbitControls.autoRotate = true;

        //controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

        this.orbitControls.addEventListener('change', () => {
            this.renderer.render(this.scene, this.camera);
        });
    }

    render() {
        // OrbitControls nếu có enableDamping hoặc autoRotate thì phải update ở đây
        // this.orbitControls.update();

        this.renderer.render(this.scene, this.camera);
        // requestAnimationFrame(this.render.bind(this));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
