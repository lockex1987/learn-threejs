import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    PointLight,
    AmbientLight,
    AnimationMixer,
    Clock,
    Box3,
    Vector3
} from 'https://unpkg.com/three@0.132.0/build/three.module.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.132.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.132.0/examples/jsm/controls/OrbitControls.js';


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();
        this.createControls();
        this.loadModel();
        this.handleResize();

        // TODO: Switch các model
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0xFFFFFF);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.set(0, 2, 2);
        this.camera.lookAt(this.scene.position);
    }

    createRenderer(canvas) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const aspectRatio = window.devicePixelRatio;
        this.renderer.setSize(canvas.clientWidth * aspectRatio, canvas.clientHeight * aspectRatio, false);
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
        // const model = { url: '../models/nissan_gtr.glb', scale: 0.3, animation: false, whole: true };
        const model = { url: '../models/keangnam/scene.gltf', scale: 0.0007, animation: false, whole: true };
        // const model = { url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', scale: 0.5, animation: false, whole: false };
        // const model = { url: 'https://threejs.org/examples/models/gltf/Flamingo.glb', scale: 0.01, animation: true, whole: false };
        // const model = { url: 'https://threejs.org/examples/models/gltf/Parrot.glb', scale: 0.01, animation: true, whole: false };
        // const model = { url: 'https://threejs.org/examples/models/gltf/Stork.glb', scale: 0.01, animation: true, whole: false };

        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(model.url);
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

        const mesh = model.whole ? gltf.scene : gltf.scene.children[0];
        console.log(mesh);

        mesh.scale.multiplyScalar(model.scale);

        const box = new Box3().setFromObject(mesh);
        const center = new Vector3();
        box.getCenter(center);
        mesh.position.sub(center);
        // mesh.geometry.center();

        this.scene.add(mesh);

        if (model.animation) {
            this.setupAnimation(mesh, gltf);
        }

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

    handleResize() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    onResize() {
        const canvas = this.renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
