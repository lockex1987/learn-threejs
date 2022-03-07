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
    RectAreaLight,
    Mesh,
    CameraHelper
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';

import { GUI } from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';

class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createCube();
        this.createSphere();
        this.createGround();
        this.createAmbientLight();
        this.createSpotLight();
        this.createPointLight();
        this.createDirectionalLight();
        this.createHemisphereLight();
        this.createRectAreaLight();
        this.createOrbitControls();
        const selectedLight = window.location.hash.substring(1) || 'Ambient';
        this.initSelectedLight(selectedLight);
        requestAnimationFrame(this.render.bind(this));
        this.handleResize();
        this.createControlsGui(selectedLight);
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0x444444);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 5, 30);
        this.camera.position.set(10, 10, 10);
        this.camera.lookAt(this.scene.position);
    }

    createRenderer(canvas) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        this.renderer.setSize(width, height, false);
        this.renderer.shadowMap.enabled = true;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(1, 1, 1);
        /*
        const cubeMaterial = new MeshStandardMaterial({
            color: 0xff0000,
            // color: 0x7777ff,
            // roughness: 0
        });
        */
        const colors = [
            0x009e60,
            0x0051ba,
            0xffd500,
            0xff5800,
            0xC41E3A,
            0xffffff
        ];
        const cubeMaterials = colors.map(color => (new MeshStandardMaterial({ color: color })));
        this.cube = new Mesh(cubeGeometry, cubeMaterials);
        this.cube.castShadow = true;
        this.cube.position.set(-3, 1, 0);
        this.cube.tick = (ms) => {
            const angle = ms * Math.PI / 1000;
            this.cube.rotation.x = angle;
            this.cube.rotation.y = angle;
            this.cube.rotation.z = angle;
        };
        this.scene.add(this.cube);
    }

    createSphere() {
        const sphereGeometry = new SphereGeometry(0.5, 15, 15);
        const sphereMaterial = new MeshStandardMaterial({
            color: 0x7777ff
        });
        this.sphere = new Mesh(sphereGeometry, sphereMaterial);
        this.sphere.castShadow = true;
        this.sphere.position.set(4, 1, 0);
        this.sphere.tick = (ms) => {
            const temp = ms * 0.002;
            this.sphere.position.x = 2 + (2 * (Math.cos(temp)));
            this.sphere.position.y = 0.5 + (2 * Math.abs(Math.sin(temp))); // 0.5 là bán kính quả cầu
        };
        this.scene.add(this.sphere);
    }

    createGround() {
        const groundGeometry = new PlaneGeometry(10, 3);
        const groundMaterial = new MeshStandardMaterial({
            color: 0xffffff
        });
        groundMaterial.side = DoubleSide;
        this.ground = new Mesh(groundGeometry, groundMaterial);
        this.ground.receiveShadow = true;
        this.ground.rotation.x = 0.5 * Math.PI;
        this.scene.add(this.ground);
    }

    createAmbientLight() {
        const color = '#d2d2d2';
        const intensity = 1;
        this.ambientLight = new AmbientLight(color, intensity);
        this.ambientLight.visible = false;
        this.scene.add(this.ambientLight);
    }

    createSpotLight() {
        this.spotLight = new SpotLight('#eeeeee');
        this.spotLight.visible = false;
        this.spotLight.position.set(0, 5, 0);
        this.spotLight.target = this.ground;
        this.spotLight.distance = 10; // 0 là vô hạn
        this.spotLight.angle = Math.PI * 0.1;
        this.spotLight.castShadow = true;
        this.spotLight.shadow.camera.near = 1;
        this.spotLight.shadow.camera.far = 12;
        this.spotLight.shadow.camera.fov = 20;

        this.spotLightHelper = new SpotLightHelper(this.spotLight);
        this.spotLightHelper.visible = false;

        this.spotCameraHelper = new CameraHelper(this.spotLight.shadow.camera);
        this.spotCameraHelper.visible = false;

        this.scene.add(
            this.spotLight,
            this.spotLightHelper,
            this.spotCameraHelper
        );
    }

    createPointLight() {
        const sphereGeometry = new SphereGeometry(0.05);
        const sphereMaterial = new MeshBasicMaterial({
            color: 0xac6c25
        });
        this.pointMarker = new Mesh(sphereGeometry, sphereMaterial);
        this.pointMarker.visible = false;
        this.pointMarker.position.set(0, 3, 0);

        this.pointLight = new PointLight('#eeeeee');
        this.pointLight.decay = 0.1;
        this.pointLight.castShadow = true;
        this.pointLight.visible = false;
        this.pointLight.position.copy(this.pointMarker.position);

        this.pointLight.tick = (ms) => {
            const angle = (ms / 100) * 0.1;
            this.pointMarker.position.y = 4 + 2 * Math.sin(angle);
            this.pointLight.position.copy(this.pointMarker.position);
        };

        this.scene.add(this.pointLight);
        this.scene.add(this.pointMarker);
    }

    createDirectionalLight() {
        const sphereGeometry = new SphereGeometry(0.05);
        const sphereMaterial = new MeshBasicMaterial({
            color: 0xac6c25
        });
        this.directionalMarker = new Mesh(sphereGeometry, sphereMaterial);
        this.directionalMarker.visible = false;
        this.directionalMarker.position.set(-5, 10, -4);

        this.directionalLight = new DirectionalLight('#eeeeee');
        this.directionalLight.intensity = 1.5;
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.camera.near = 2;
        this.directionalLight.shadow.camera.far = 15;
        this.directionalLight.shadow.camera.left = -3;
        this.directionalLight.shadow.camera.right = 3;
        this.directionalLight.shadow.camera.top = 3;
        this.directionalLight.shadow.camera.bottom = -3;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        this.directionalLight.visible = false;
        this.directionalLight.position.copy(this.directionalMarker.position);

        this.directionalLight.tick = (ms) => {
            const angle = (ms / 100) * 0.1;
            this.directionalMarker.position.y = 3 + 2 * Math.sin(angle);
            this.directionalMarker.position.z = 2 * Math.cos(angle);
            this.directionalLight.position.copy(this.directionalMarker.position);
        };

        this.directionalCameraHelper = new CameraHelper(this.directionalLight.shadow.camera);
        this.directionalCameraHelper.visible = false;

        this.scene.add(this.directionalLight);
        this.scene.add(this.directionalMarker);
        this.scene.add(this.directionalCameraHelper);
    }

    createHemisphereLight() {
        this.hemisphereLight = new HemisphereLight(0xf0e424, 0xd41384, 0.6);
        this.hemisphereLight.position.set(0, 5, 0);
        this.hemisphereLight.visible = false;
        this.scene.add(this.hemisphereLight);
    }

    createRectAreaLight() {
        this.rectAreaLight = new RectAreaLight(0xff00ff, 10, 2, 5);
        this.rectAreaLight.position.set(0, 2.5, -2);
        this.rectAreaLight.visible = false;
        // this.rectAreaLight.lookAt(this.ground);
        this.rectAreaLight.lookAt(0, 0, 0);
        this.scene.add(this.rectAreaLight);

        const planeGeometry = new BoxGeometry(2, 5, 0);
        const planeMaterial = new MeshBasicMaterial({
            color: 0xff00ff
        });
        this.rectAreaMarker = new Mesh(planeGeometry, planeMaterial);
        this.rectAreaMarker.position.copy(this.rectAreaLight.position);
        this.rectAreaMarker.visible = false;
        this.scene.add(this.rectAreaMarker);
    }

    createControlsGui(selectedLight) {
        const controls = {
            ambientColor: this.ambientLight.color.getHex(),
            spotColor: this.spotLight.color.getHex(),
            spotTarget: 'Ground',
            pointColor: this.pointLight.color.getHex(),
            directionalColor: this.directionalLight.color.getHex(),
            directionalTarget: 'Ground',
            hemisphereColor: this.hemisphereLight.color.getHex(),
            hemisphereGroundColor: this.hemisphereLight.groundColor.getHex(),
            rectAreaColor: this.rectAreaLight.color.getHex()
        };

        const gui = new GUI();

        const ambientFolder = gui.addFolder('AmbientLight');
        ambientFolder.add(this.ambientLight, 'visible');
        ambientFolder.addColor(controls, 'ambientColor')
            .name('color')
            .onChange(color => {
                this.ambientLight.color.set(color);
            });
        ambientFolder.add(this.ambientLight, 'intensity', 0, 3, 0.1);
        if (selectedLight == 'Ambient') {
            ambientFolder.open();
        }

        const spotFolder = gui.addFolder('SpotLight');
        spotFolder.add(this.spotLight, 'visible');
        spotFolder.addColor(controls, 'spotColor')
            .name('color')
            .onChange(color => {
                this.spotLight.color.set(color);
            });
        spotFolder.add(this.spotLight, 'intensity', 0, 5);
        spotFolder.add(this.spotLight, 'castShadow');
        spotFolder.add(this.spotLight, 'angle', 0, Math.PI);
        spotFolder.add(this.spotLight, 'penumbra', 0, 1);
        spotFolder.add(this.spotLight, 'distance', 0, 20);
        spotFolder.add(controls, 'spotTarget', ['Ground', 'Sphere', 'Cube'])
            .name('target')
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
        spotFolder.add(this.spotLightHelper, 'visible')
            .name('helper');
        spotFolder.add(this.spotCameraHelper, 'visible')
            .name('camera');
        if (selectedLight == 'Spot') {
            spotFolder.open();
        }

        const pointFolder = gui.addFolder('PointLight');
        pointFolder.add(this.pointLight, 'visible');
        pointFolder.add(this.pointLight, 'castShadow');
        pointFolder.addColor(controls, 'pointColor')
            .name('color')
            .onChange(color => {
                this.pointLight.color.set(color);
            });
        pointFolder.add(this.pointLight, 'intensity', 0, 3);
        pointFolder.add(this.pointLight, 'distance', 0, 12); // 0 là vô hạn
        pointFolder.add(this.pointMarker, 'visible')
            .name('marker');
        if (selectedLight == 'Point') {
            pointFolder.open();
        }

        const directionalFolder = gui.addFolder('DirectionalLight');
        directionalFolder.add(this.directionalLight, 'visible');
        directionalFolder.add(this.directionalLight, 'castShadow');
        directionalFolder.addColor(controls, 'directionalColor')
            .name('color')
            .onChange(color => {
                this.directionalLight.color.set(color);
            });
        directionalFolder.add(this.directionalLight, 'intensity', 0, 5);
        directionalFolder.add(controls, 'directionalTarget', ['Ground', 'Sphere', 'Cube'])
            .name('target')
            .onChange(target => {
                switch (target) {
                case 'Ground':
                    this.directionalLight.target = this.ground;
                    break;
                case 'Sphere':
                    this.directionalLight.target = this.sphere;
                    break;
                case 'Cube':
                    this.directionalLight.target = this.cube;
                    break;
                }
            });

        directionalFolder.add(this.directionalMarker, 'visible')
            .name('marker');
        directionalFolder.add(this.directionalCameraHelper, 'visible')
            .name('camera');
        if (selectedLight == 'Directional') {
            directionalFolder.open();
        }

        const hemisphereFolder = gui.addFolder('HemisphereLight');
        hemisphereFolder.add(this.hemisphereLight, 'visible');
        hemisphereFolder.addColor(controls, 'hemisphereColor')
            .name('sky')
            .onChange(color => {
                this.hemisphereLight.color.set(color);
            });
        hemisphereFolder.addColor(controls, 'hemisphereGroundColor')
            .name('ground')
            .onChange(color => {
                this.hemisphereLight.groundColor.set(color);
            });
        hemisphereFolder.add(this.hemisphereLight, 'intensity', 0, 5);
        if (selectedLight == 'Hemisphere') {
            hemisphereFolder.open();
        }

        const rectAreaFolder = gui.addFolder('RectAreaLight');
        rectAreaFolder.add(this.rectAreaLight, 'visible')
            .onChange(visible => {
                this.rectAreaMarker.visible = visible;
            });
        rectAreaFolder.addColor(controls, 'rectAreaColor')
            .name('color')
            .onChange(color => {
                this.rectAreaLight.color.set(color);
            });
        rectAreaFolder.add(this.rectAreaLight, 'intensity', 0, 70);
        if (selectedLight == 'RectArea') {
            rectAreaFolder.open();
        }

        // gui.close();
    }

    createOrbitControls() {
        // this.trackballControls = new TrackballControls(this.camera, this.renderer.domElement);
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.rotateSpeed = 3;
        this.orbitControls.zoomSpeed = 1.2;
        this.orbitControls.panSpeed = 0.8;
    }

    update(ms) {
        this.cube.tick(ms);
        this.sphere.tick(ms);
        this.pointLight.tick(ms);
        this.directionalLight.tick(ms);
    }

    render(ms) {
        this.orbitControls.update();
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
        // this.trackballControls.handleResize(); // TrackballControls cần, OrbitControls không
    }

    initSelectedLight(selectedLight) {
        switch (selectedLight) {
        case 'Ambient':
            this.ambientLight.visible = true;
            break;
        case 'Spot':
            this.spotLight.visible = true;
            this.spotLightHelper.visible = true;
            this.spotCameraHelper.visible = true;
            break;
        case 'Point':
            this.pointLight.visible = true;
            this.pointMarker.visible = true;
            break;
        case 'Directional':
            this.directionalLight.visible = true;
            this.directionalMarker.visible = true;
            this.directionalCameraHelper.visible = true;
            break;
        case 'Hemisphere':
            this.hemisphereLight.visible = true;
            break;
        case 'RectArea':
            this.rectAreaLight.visible = true;
            this.rectAreaMarker.visible = true;
            break;
        }
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
