import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);
        const cube = this.createCube();
        this.scene.add(cube);
        this.render();
        this.handleResize();
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
        const cubeGeometry = new BoxGeometry(6, 6, 6);
        const cubeMaterial = new MeshNormalMaterial();
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.position.set(-4, 3, 0);
        return cube;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.onResize();
            this.render();
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
