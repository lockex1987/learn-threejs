import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    SphereGeometry,
    PlaneGeometry,
    DoubleSide,
    MeshStandardMaterial,
    MeshBasicMaterial,
    AmbientLight,
    SpotLight,
    SpotLightHelper,
    PointLight,
    DirectionalLight,
    HemisphereLight,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { TrackballControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/TrackballControls.js';

import { GUI } from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';

class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);
        this.createCube();
        this.createSphere();
        this.createGround();
        this.createAmbientLight();
        this.createSpotLight();
        this.createPointLight();
        this.createTrackballControls();
        requestAnimationFrame(this.render.bind(this));
        this.handleResize();
        this.createControlsGui();
    }

    createScene() {
        const scene = new Scene();
        scene.background = new Color(0x444444);
        return scene;
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        const camera = new PerspectiveCamera(45, aspect, 5, 30);
        camera.position.set(10, 10, 10);
        camera.lookAt(this.scene.position);
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        renderer.setSize(width, height, false);
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(1, 1, 1);
        const cubeMaterial = new MeshStandardMaterial({
            color: 0xff0000
        });
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;
        cube.position.set(-4, 1, 0);
        cube.tick = (ms) => {
            const angle = ms * Math.PI / 1000;
            cube.rotation.x = angle;
            cube.rotation.y = angle;
            cube.rotation.z = angle;
        };

        this.cube = cube;
        this.scene.add(this.cube);
    }

    createSphere() {
        const sphereGeometry = new SphereGeometry(0.5, 15, 15);
        const sphereMaterial = new MeshStandardMaterial({
            color: 0x7777ff
        });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        sphere.position.set(4, 1, 0);
        sphere.tick = (ms) => {
            const temp = ms * 0.002;
            sphere.position.x = 2 + (2 * (Math.cos(temp)));
            sphere.position.y = 0.5 + (2 * Math.abs(Math.sin(temp))); // 0.5 là bán kính quả cầu
        };
        this.sphere = sphere;
        this.scene.add(this.sphere);
    }

    createGround() {
        const groundGeometry = new PlaneGeometry(10, 2);
        const groundMaterial = new MeshStandardMaterial({
            color: 0xffffff
        });
        groundMaterial.side = DoubleSide;
        const ground = new Mesh(groundGeometry, groundMaterial);
        ground.receiveShadow = true;
        ground.rotation.x = 0.5 * Math.PI;
        this.ground = ground;
        this.scene.add(this.ground);
    }

    createAmbientLight() {
        const ambientLight = new AmbientLight('#1c1c1c', 1);
        this.ambientLight = ambientLight;
        this.scene.add(this.ambientLight);
    }

    createSpotLight() {
        const spotLight = new SpotLight('#ffffff');
        spotLight.position.set(0, 5, 0);
        spotLight.target = this.ground;
        spotLight.castShadow = true;
        spotLight.shadow.camera.near = 1;
        spotLight.shadow.camera.far = 50;
        spotLight.shadow.camera.fov = 120;
        spotLight.distance = 0;
        spotLight.angle = Math.PI * 0.1;
        spotLight.visible = false;

        this.spotLight = spotLight;

        this.spotLightHelper = new SpotLightHelper(this.spotLight);
        this.spotLightHelper.visible = false;

        this.scene.add(
            this.spotLight,
            this.spotLightHelper
        );
    }

    createPointLight() {
        const pointLight = new PointLight('#ccffcc');
        pointLight.decay = 0.1;
        pointLight.castShadow = true;

        const sphereGeometry = new SphereGeometry(0.05);
        const sphereMaterial = new MeshBasicMaterial({
            color: 0xac6c25
        });
        const pointLightPosition = new Mesh(sphereGeometry, sphereMaterial);
        pointLightPosition.position.set(0, 3, 0);
        this.scene.add(pointLightPosition);

        this.pointLight = pointLight;
        this.pointLight.position.copy(pointLightPosition.position);
        this.scene.add(this.pointLight);

        this.pointLight.tick = (ms) => {
            const height = 3 + 2 * Math.sin((ms / 100) * 0.1);
            pointLightPosition.position.y = height;
            this.pointLight.position.copy(pointLightPosition.position);
        };
    }

    createControlsGui() {
        const controls = {
            ambientColor: this.ambientLight.color.getStyle(),
            spotColor: this.spotLight.color.getStyle(),
            spotTarget: 'Ground'
        };

        const gui = new GUI();

        const ambientFolder = gui.addFolder('AmbientLight');
        ambientFolder.add(this.ambientLight, 'visible');
        ambientFolder.addColor(controls, 'ambientColor')
            .onChange(color => {
                this.ambientLight.color.set(color);
            });
        ambientFolder.open();

        const spotFolder = gui.addFolder('SpotLight');
        spotFolder.add(this.spotLight, 'visible');
        spotFolder.addColor(controls, 'spotColor')
            .onChange(color => {
                this.spotLight.color.set(color);
            });
        spotFolder.add(this.spotLightHelper, 'visible')
            .name('spotLightHelper');
        spotFolder.add(this.spotLight, 'castShadow');
        spotFolder.add(controls, 'spotTarget', ['Ground', 'Sphere', 'Cube'])
            .onChange(value => {
                switch (value) {
                case 'Ground':
                    this.spotLight.target = this.ground;
                    break;
                case 'Sphere':
                    this.spotLight.target = this.sphere;
                    break;
                case 'Cube':
                    this.spotLight.target = this.cube;
                    break;
                }
            });
        spotFolder.open();

        const pointFolder = gui.addFolder('PointLight');
        pointFolder.add(this.pointLight, 'visible');
        pointFolder.open();
    }

    createTrackballControls() {
        this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
        this.trackballControls.rotateSpeed = 3;
        this.trackballControls.zoomSpeed = 1.2;
        this.trackballControls.panSpeed = 0.8;
    }

    update(ms) {
        this.cube.tick(ms);
        this.sphere.tick(ms);
        this.pointLight.tick(ms);
    }

    render(ms) {
        this.trackballControls.update();
        this.spotLightHelper.update();
        this.update(ms);
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
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        const aspect = width / height;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.trackballControls.handleResize();
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
