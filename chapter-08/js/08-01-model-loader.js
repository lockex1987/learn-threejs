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
    Vector3,
    GridHelper
} from 'https://unpkg.com/three@0.132.0/build/three.module.js';

import { GLTFLoader } from 'https://unpkg.com/three@0.132.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.132.0/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();
        const gridHelper = new GridHelper(5, 5);
        // this.scene.add(gridHelper);
        this.createControls();

        this.progressBarDiv = document.querySelector('#progressBarDiv');

        this.models = [
            { name: 'Flamingo', url: 'https://threejs.org/examples/models/gltf/Flamingo.glb', whole: false },
            { name: 'Parrot', url: 'https://threejs.org/examples/models/gltf/Parrot.glb', whole: false },
            { name: 'Stork', url: 'https://threejs.org/examples/models/gltf/Stork.glb', whole: false },
            { name: 'Damaged Helmet', url: 'https://threejs.org/examples/models/gltf/DamagedHelmet/glTF/DamagedHelmet.gltf', whole: false },
            { name: 'Nissan Car', url: '../models/nissan_gtr.glb', whole: true },
            { name: 'Keangnam', url: '../models/keangnam/scene.gltf', whole: true },
            // CC-BY 3.0 license: Living Room by Alex “SAFFY” Safayan [CC-BY], via Poly Pizza
            { name: 'Living Room', url: '../models/living_room.glb', whole: true },
            { name: 'One Pillar Pagoda', url: '../models/one_pillar_pagoda/scene.gltf', whole: true },
            { name: 'China Flag', url: '../models/china/scene.gltf', whole: true }
        ];
        const model = this.models[0];
        this.loadModel(model);
        this.handleResize();
        this.createControlsGui();
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

    async loadModel(model) {
        this.updateProgressBar(0);
        this.showProgressBar();

        const gltfLoader = new GLTFLoader();
        const gltf = await gltfLoader.loadAsync(model.url, this.onProgress.bind(this));
        // console.log(gltf);

        const mesh = model.whole ? gltf.scene : gltf.scene.children[0];
        this.mesh = mesh;

        this.resizeAndCenter(mesh);

        this.scene.add(mesh);
        // console.log(gltf);

        if (gltf.animations.length) {
            this.setupAnimation(mesh, gltf);
        }

        requestAnimationFrame(this.render.bind(this));

        this.hideProgressBar();
    }

    resetModel() {
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer = null;
        }

        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
    }

    resizeAndCenter(mesh) {
        const box = new Box3().setFromObject(mesh);
        const size = box.getSize(new Vector3());
        const maxSize = Math.max(size.x, size.y, size.z);
        const desizedSize = 1.5;
        mesh.scale.multiplyScalar(desizedSize / maxSize);

        box.setFromObject(mesh);
        const center = box.getCenter(new Vector3());
        mesh.position.sub(center);
    }

    setupAnimation(mesh, gltf) {
        this.clock = new Clock();

        this.mixer = new AnimationMixer(mesh);
        const clip = gltf.animations[0];
        const action = this.mixer.clipAction(clip);
        action.play();
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

    createControlsGui() {
        const options = this.models.map(model => model.name);
        const gui = new GUI();
        const controls = {
            model: options[0]
        };
        gui.add(controls, 'model', options)
            .onChange(modelName => {
                this.resetModel();
                const model = this.models.find(e => e.name == modelName);
                this.loadModel(model);
            });
    }

    showProgressBar() {
        this.progressBarDiv.style.display = '';
    }

    hideProgressBar() {
        this.progressBarDiv.style.display = 'none';
    }

    updateProgressBar(fraction) {
        this.progressBarDiv.innerText = 'Loading... ' + Math.round(fraction * 100, 2) + '%';
    }

    onProgress(xhr) {
        if (xhr.lengthComputable) {
            this.updateProgressBar(xhr.loaded / xhr.total);
        }
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
