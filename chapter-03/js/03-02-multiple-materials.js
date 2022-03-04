import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);
        this.cube = this.createCube();
        this.scene.add(this.cube);
        requestAnimationFrame(this.render.bind(this));
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;
        const camera = new PerspectiveCamera(45, aspect, 30, 90);
        camera.position.z = 40;
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        renderer.setClearColor(new Color(0xAAAAAA));
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        renderer.setSize(width, height, false);
        return renderer;
    }

    createCube() {
        // Danh sách màu sắc
        const colors = [
            0x009e60,
            0x0051ba,
            0xffd500,
            0xff5800,
            0xC41E3A,
            0xffffff
        ];

        // Danh sách các Material
        const cubeMaterials = colors.map(color => (new MeshBasicMaterial({ color: color })));

        const cubeGeometry = new BoxGeometry(10, 10, 10);
        const cubeMesh = new Mesh(cubeGeometry, cubeMaterials);

        cubeMesh.tick = ms => {
            const angle = ms * (Math.PI / 4) / 1000;
            cubeMesh.rotation.y = angle;
            cubeMesh.rotation.z = angle;
            cubeMesh.rotation.x = angle;
        };

        return cubeMesh;
    }

    update(ms) {
        this.cube.tick(ms);
    }

    render(ms) {
        this.update(ms);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
