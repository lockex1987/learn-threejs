import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    SpotLight,
    AmbientLight,
    Vector2,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);

        const spotLight = this.createSpotLight();
        this.scene.add(spotLight);

        const ambienLight = this.createAmbientLight();
        this.scene.add(ambienLight);

        this.createControls();
        // this.render();
        this.loadModels();
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(this.scene.position);
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        renderer.setClearColor(new Color(0x000000));
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    loadModels() {
        // const url = '../models/watermelon/scene.gltf';
        // const url = '../models/bank_of_china_tower/scene.gltf';
        // const url = '../models/fighter_jet_russian/fighter_jet_russian.obj';
        const url = '../models/cat/cat.obj';

        const onLoad = model => {
            console.log(model);

            // gltf.scene.children[0].geometry.center();

            /*
            gltf.scene.traverse(function (node) {
                if (node instanceof Mesh) {
                    node.castShadow = true;
                    // node.material.side = DoubleSide;
                    node.geometry.center();
                }
            });
            */

            // GLTF
            // const mesh = model.scene;
            // const tower = model.scene.children[0];
            // const mesh = tower;

            // OBJ
            const mesh = model;

            const scale = 0.5;
            mesh.scale.set(scale, scale, scale);
            this.scene.add(mesh);
            console.log(mesh.position);
            this.render();
        };
        const onError = error => {
            console.error(error);
        };
        // const loader = new GLTFLoader();
        const loader = new OBJLoader();
        loader.load(url, onLoad, undefined, onError);
    }

    createControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        // console.log(this);
        controls.addEventListener('change', this.render.bind(this)); // use if there is no animation loop

        // controls.minDistance = 2;
        // controls.maxDistance = 10;
        // controls.target.set(0, 0, -0.2);

        controls.update();

        this.controls = controls;
    }

    /**
     * Add spotlight for the shadows.
     */
    createSpotLight() {
        const spotLight = new SpotLight(0xFFFFFF);
        spotLight.position.set(-40, 40, -15);
        spotLight.castShadow = true;

        spotLight.shadow.mapSize = new Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;

        // If you want a more detailled shadow you can increase the
        // mapSize used to draw the shadows
        // spotLight.shadow.mapSize = new Vector2(1024, 1024);

        return spotLight;
    }

    createAmbientLight() {
        const ambienLight = new AmbientLight(0x353535);
        return ambienLight;
    }

    render() {
        // this.controls.update();
        this.renderer.render(this.scene, this.camera);
        // requestAnimationFrame(this.render.bind(this));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
