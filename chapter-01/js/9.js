// import * as THREE from '../../libs/three.js-r137/build/three.module.js';

/*
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh
} from '../../libs/three.js-r137/build/three.module.js';
*/

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BoxGeometry,
    MeshNormalMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);
        this.cube = this.createCube();
        this.scene.add(this.cube);

        this.render();

        // container.appendChild(this.renderer.domElement);
        // this.setSize();
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera(canvas) {
        console.log(canvas.clientWidth, canvas.clientHeight);
        // console.log(canvas.clientWidth, canvas.clientHeight);
        const aspect = canvas.clientWidth / canvas.clientHeight;
        // const aspect = window.clientWidth / window.clientHeight;
        const camera = new PerspectiveCamera(
            70,
            aspect,
            0.01,
            10
        );
        camera.position.z = 1;
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        // renderer.physicallyCorrectLights = true;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        return renderer;
    }

    createCube() {
        const geometry = new BoxGeometry(0.2, 0.2, 0.2);
        const material = new MeshNormalMaterial();
        const mesh = new Mesh(geometry, material);

        mesh.tick = () => {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.02;
        };

        return mesh;
    }

    update() {
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.02;

        this.cube.tick();
    }

    render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}

new ThreejsExample(document.querySelector('#webglOutput'));
