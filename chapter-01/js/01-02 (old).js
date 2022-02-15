import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    AxesHelper,
    PlaneGeometry,
    BoxGeometry,
    SphereGeometry,
    MeshBasicMaterial,
    MeshNormalMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';


class ThreejsExample {
    constructor() {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer();

        const axes = this.createAxes();
        this.scene.add(axes);

        const plane = this.createPlane();
        this.scene.add(plane);

        const cube = this.createCube();
        this.scene.add(cube);

        const sphere = this.createSphere();
        this.scene.add(sphere);

        this.render();
    }

    createScene() {
        // Create a scene, that will hold all our elements such as objects, cameras and lights
        const scene = new Scene();
        return scene;
    }

    createCamera() {
        // Create a camera, which defines where we're looking at
        const aspect = window.innerWidth / window.innerHeight;
        const camera = new PerspectiveCamera(45, aspect, 0.1, 1000);

        // Position and point the camera to the center of the scene
        camera.position.set(-30, 40, 30);
        camera.lookAt(this.scene.position);
        return camera;
    }

    createRenderer() {
        // Create a render and set the size
        const renderer = new WebGLRenderer({
            canvas: document.querySelector('#webglOutput')
        });
        renderer.setClearColor(new Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }

    createAxes() {
        // Show axes in the screen
        const axes = new AxesHelper(20);
        return axes;
    }

    createPlane() {
        // Create the ground plane
        const planeGeometry = new PlaneGeometry(60, 20);
        const planeMaterial = new MeshBasicMaterial({
            color: 0xAAAAAA
        });
        const plane = new Mesh(planeGeometry, planeMaterial);

        // Rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);

        return plane;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(4, 4, 4);
        /*
        const cubeMaterial = new MeshBasicMaterial({
            color: 0xFF0000,
            wireframe: true
        });
        */
        const cubeMaterial = new MeshNormalMaterial();
        const cube = new Mesh(cubeGeometry, cubeMaterial);

        // Position the cube
        cube.position.set(-4, 3, 0);

        return cube;
    }

    createSphere() {
        const sphereGeometry = new SphereGeometry(4, 20, 20);
        const sphereMaterial = new MeshBasicMaterial({
            color: 0x7777FF,
            wireframe: true
        });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);

        // Position the sphere
        sphere.position.set(20, 4, 2);

        return sphere;
    }

    render() {
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}


new ThreejsExample();
