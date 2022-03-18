import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    PointLight,
    AmbientLight,
    AnimationMixer,
    Clock
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();
        this.createControls();

        this.loadModel();
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0xFFFFFF);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.set(0, 2, 2);
        this.camera.lookAt(this.scene.position);
    }

    createRenderer(canvas) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const aspectRatio = window.devicePixelRatio;
        this.renderer.setSize(canvas.clientWidth * aspectRatio, canvas.clientHeight * aspectRatio);
    }

    createLights() {
        const ambienLight = new AmbientLight(0x353535);
        this.scene.add(ambienLight);

        const pointLight = new PointLight(0xFFFFFF);
        pointLight.position.set(0, 2, 2);
        this.scene.add(pointLight);
    }

    createControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
    }

    async loadModel() {
        // const url = '../models/watermelon/scene.gltf';
        // const url = '../models/nissan_gtr.glb'; // 4
        // const url = '../models/flamingo.glb';
        const url = 'https://threejs.org/examples/models/gltf/Flamingo.glb'; // 0.2
        // const url = '../models/bank_of_china_tower/scene.gltf';
        // const url = '../models/fighter_jet_russian/fighter_jet_russian.obj';
        // const url = '../models/cat/cat.obj';
        const gltfLoader = new GLTFLoader();
        // const loader = new OBJLoader();

        const gltf = await gltfLoader.loadAsync(url);
        console.log(gltf);

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
        // const mesh = gltf.scene;
        const mesh = gltf.scene.children[0];
        // const tower = model.scene.children[0];
        // const mesh = tower;

        // OBJ
        // const mesh = model;

        const scale = 0.005;
        mesh.scale.multiplyScalar(scale);
        this.scene.add(mesh);
        // console.log(mesh.position);

        this.setupAnimation(mesh, gltf);

        requestAnimationFrame(this.render.bind(this));
    }

    setupAnimation(mesh, gltf) {
        this.clock = new Clock();
        const clip = gltf.animations[0];
        this.mixer = new AnimationMixer(mesh);
        this.action = this.mixer.clipAction(clip);
        this.action.play();
    }

    render() {
        this.orbitControls.update();
        if (this.mixer) {
            const delta = this.clock.getDelta();
            this.mixer.update(delta);
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
