import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    PlaneGeometry,
    SphereGeometry,
    MeshLambertMaterial,
    Mesh,
    AmbientLight,
    SpotLight,
    Clock
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

// import { initTrackballControls } from '../../js/utils.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);

        const plane = this.createPlane();
        this.scene.add(plane);

        this.cube = this.createCube();
        this.scene.add(this.cube);

        this.sphere = this.createSphere();
        this.scene.add(this.sphere);

        const ambienLight = this.createAmbientLight();
        this.scene.add(ambienLight);

        const spotLight = this.createSpotLight();
        this.scene.add(spotLight);

        this.controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03
        };
        this.createGui();

        // this.stats = initStats();

        // Call the render function
        this.step = 0;

        // Attach them here, since appendChild needs to be called first
        // this.trackballControls = initTrackballControls(this.camera, this.renderer);

        this.clock = new Clock();

        this.render();
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.x = -30;
        camera.position.y = 40;
        camera.position.z = 30;
        camera.lookAt(this.scene.position);
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas
        });
        renderer.setClearColor(new Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    createPlane() {
        const planeGeometry = new PlaneGeometry(60, 20, 1, 1);
        const planeMaterial = new MeshLambertMaterial({ color: 0xffffff });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        return plane;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(4, 4, 4);
        const cubeMaterial = new MeshLambertMaterial({ color: 0xff0000 });
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        cube.position.x = -4;
        cube.position.y = 3;
        cube.position.z = 0;

        return cube;
    }

    createSphere() {
        const sphereGeometry = new SphereGeometry(4, 20, 20);
        const sphereMaterial = new MeshLambertMaterial({ color: 0x7777ff });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = 20;
        sphere.position.y = 0;
        sphere.position.z = 2;
        sphere.castShadow = true;

        return sphere;
    }

    createAmbientLight() {
        const ambienLight = new AmbientLight(0x353535);
        return ambienLight;
    }

    createSpotLight() {
        const spotLight = new SpotLight(0xffffff);
        spotLight.position.set(-10, 20, -5);
        spotLight.castShadow = true;
        return spotLight;
    }

    createGui() {
        const gui = new dat.GUI();
        gui.add(this.controls, 'rotationSpeed', 0, 0.5);
        gui.add(this.controls, 'bouncingSpeed', 0, 0.5);
    }

    update() {
        // Rotate the cube around its axes
        this.cube.rotation.x += this.controls.rotationSpeed;
        this.cube.rotation.y += this.controls.rotationSpeed;
        this.cube.rotation.z += this.controls.rotationSpeed;

        // Bounce the sphere up and down
        this.step += this.controls.bouncingSpeed;

        this.sphere.position.x = 20 + (10 * (Math.cos(this.step)));
        this.sphere.position.y = 2 + (10 * Math.abs(Math.sin(this.step)));
    }

    render() {
        // Update the stats and the controls
        // this.trackballControls.update(this.clock.getDelta());
        // this.stats.update();
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
