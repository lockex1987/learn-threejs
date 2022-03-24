import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    PointLight,
    AmbientLight,
    DirectionalLight,
    TextureLoader,
    SphereGeometry,
    MeshPhongMaterial,
    MeshBasicMaterial,
    Mesh,
    BackSide
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


class ThreejsExample {
    constructor(canvas) {
        this.scene = new Scene();

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 1.5;

        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const aspectRatio = window.devicePixelRatio;
        this.renderer.setSize(width * aspectRatio, height * aspectRatio, false);

        this.setupLights(this.scene);

        const radius = 0.5;
        const segments = 48;
        const textureLoader = new TextureLoader();

        this.sphere = this.createSphere(radius, segments, textureLoader);
        this.scene.add(this.sphere);

        this.clouds = this.createClouds(radius, segments, textureLoader);
        this.scene.add(this.clouds);

        const stars = this.createStars(90, 64, textureLoader);
        this.scene.add(stars);

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;

        requestAnimationFrame(this.render.bind(this));

        window.addEventListener('resize', () => {
            this.onResize();
        });

        // this.createControlsGui();
    }

    setupLights(scene) {
        const ambientLight = new AmbientLight(0x333333);
        scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);
    }

    createSphere(radius, segments, textureLoader) {
        return new Mesh(
            new SphereGeometry(radius, segments, segments),
            new MeshPhongMaterial({
                map: textureLoader.load('../textures/globe1/2_no_clouds_4k.jpg'),
                bumpMap: textureLoader.load('../textures/globe1/elev_bump_4k.jpg'),
                bumpScale: 0.005,
                specularMap: textureLoader.load('../textures/globe1/water_4k.png'),
                specular: new Color('grey')
            })
        );
    }

    createClouds(radius, segments, textureLoader) {
        return new Mesh(
            new SphereGeometry(radius + 0.003, segments, segments),
            new MeshPhongMaterial({
                map: textureLoader.load('../textures/globe1/fair_clouds_4k.png'),
                transparent: true
            })
        );
    }

    createStars(radius, segments, textureLoader) {
        return new Mesh(
            new SphereGeometry(radius, segments, segments),
            new MeshBasicMaterial({
                map: textureLoader.load('../textures/globe1/galaxy_starfield.png'),
                side: BackSide
            })
        );
    }

    render() {
        this.orbitControls.update();
        this.sphere.rotation.y += 0.0005;
        this.clouds.rotation.y += 0.0005;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
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
}


new ThreejsExample(document.querySelector('#webglOutput'));
