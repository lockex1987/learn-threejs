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
    AmbientLight,
    SpotLight,
    SpotLightHelper,
    PointLight,
    PointLightHelper,
    DirectionalLight,
    DirectionalLightHelper,
    HemisphereLight,
    RectAreaLight,
    // RectAreaLightHelper,
    Mesh,
    MathUtils,
    CameraHelper,
    sRGBEncoding,
    ReinhardToneMapping
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three@0.137.5/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { RectAreaLightHelper } from 'https://unpkg.com/three@0.137.5/examples/jsm/helpers/RectAreaLightHelper.js';

// import { GUI } from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


class ColorGUIHelper {
    constructor(object, prop) {
        this.object = object;
        this.prop = prop;
    }

    get value() {
        return `#${this.object[this.prop].getHexString()}`;
    }

    set value(hexString) {
        this.object[this.prop].set(hexString);
    }
}


class DegRadHelper {
    constructor(obj, prop) {
        this.obj = obj;
        this.prop = prop;
    }

    get value() {
        return MathUtils.radToDeg(this.obj[this.prop]);
    }

    set value(v) {
        this.obj[this.prop] = MathUtils.degToRad(v);
    }
}


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createCube();
        this.createSphere();
        this.createGround();

        this.createAmbientLight();
        this.createHemisphereLight();
        this.createDirectionalLight();
        this.createPointLight();
        this.createSpotLight();
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

        // this.renderer.physicallyCorrectLights = true;
        // this.renderer.outputEncoding = sRGBEncoding;
        // this.renderer.toneMapping = ReinhardToneMapping;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(1, 1, 1);
        const cubeMaterial = new MeshStandardMaterial({
            // color: 0xff0000,
            color: 0x7777ff,
            // emissive: 0xff0000,
            roughness: 0,
            metalness: 0
        });
        const colors = [
            0x009e60,
            0x0051ba,
            0xffd500,
            0xff5800,
            0xC41E3A,
            0xff0000
        ];
        const cubeMaterials = colors.map(color => (new MeshStandardMaterial({
            color: color,
            roughness: 0,
            metalness: 0
        })));
        this.cube = new Mesh(cubeGeometry, cubeMaterials);
        this.cube.castShadow = true;
        this.cube.position.set(-3, 1, 0);
        this.cube.tick = (ms) => {
            const angle = (ms / 1000) * Math.PI * 0.5;
            this.cube.rotation.x = angle;
            this.cube.rotation.y = angle;
            this.cube.rotation.z = angle;
        };
        this.scene.add(this.cube);
    }

    createSphere() {
        const sphereGeometry = new SphereGeometry(0.5, 25, 25);
        const sphereMaterial = new MeshStandardMaterial({
            color: 0x7777ff,
            roughness: 0,
            metalness: 0
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
            color: 0xffffff,
            roughness: 0.1,
            metalness: 0,
            side: DoubleSide
        });
        this.ground = new Mesh(groundGeometry, groundMaterial);
        this.ground.receiveShadow = true;
        this.ground.rotation.x = 0.5 * Math.PI;
        this.scene.add(this.ground);
    }

    createAmbientLight() {
        const color = 0xd2d2d2;
        const intensity = 1;
        this.ambientLight = new AmbientLight(color, intensity);
        this.ambientLight.visible = false;
        this.scene.add(this.ambientLight);
    }

    createHemisphereLight() {
        this.hemisphereLight = new HemisphereLight(0xf0e424, 0xd41384, 0.6);
        // this.hemisphereLight.position.set(0, 5, 0);
        this.hemisphereLight.visible = false;
        this.scene.add(this.hemisphereLight);
    }

    createDirectionalLight() {
        this.directionalLight = new DirectionalLight(0xeeeeee, 1.5);
        // this.directionalLight.intensity = 1.5;
        this.directionalLight.visible = false;
        this.directionalLight.castShadow = true;
        this.directionalLight.position.set(-5, 10, -4);

        // Phải cho đủ nếu không bóng sẽ bị cắt
        this.directionalLight.shadow.camera.near = 2;
        this.directionalLight.shadow.camera.far = 20;
        this.directionalLight.shadow.camera.left = -5;
        this.directionalLight.shadow.camera.right = 5;
        this.directionalLight.shadow.camera.top = 5;
        this.directionalLight.shadow.camera.bottom = -5;

        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;

        // Nếu thay đổi target thì phải thêm target vào cảnh, nếu không vẫn hướng tới tâm (0, 0, 0)
        // this.directionalLight.target.position.set(-5, 0, 0);
        // this.scene.add(this.directionalLight.target);

        this.directionalLight.tick = (ms) => {
            const angle = (ms / 100) * 0.1;
            this.directionalLight.position.y = 3 + 2 * Math.sin(angle);
            this.directionalLight.position.z = 2 * Math.cos(angle);
        };

        this.directionalLightHelper = new DirectionalLightHelper(this.directionalLight);
        this.directionalLightHelper.visible = false;

        this.directionalCameraHelper = new CameraHelper(this.directionalLight.shadow.camera);
        this.directionalCameraHelper.visible = false;

        this.scene.add(
            this.directionalLight,
            this.directionalLightHelper,
            this.directionalCameraHelper
        );
    }

    createPointLight() {
        this.pointLight = new PointLight(0xeeeeee);
        this.pointLight.visible = false;
        this.pointLight.castShadow = true;
        this.pointLight.position.set(0, 3, 0);
        // this.pointLight.decay = 0.1;

        this.pointLight.shadow.camera.near = 0.1;
        this.pointLight.shadow.camera.far = 12;
        this.pointLight.shadow.mapSize.width = 1024;
        this.pointLight.shadow.mapSize.height = 1024;

        this.pointLight.tick = (ms) => {
            const angle = (ms / 100) * 0.1;
            this.pointLight.position.y = 4 + 2 * Math.sin(angle);
        };

        this.pointLightHelper = new PointLightHelper(this.pointLight);
        this.pointLightHelper.visible = false;

        this.scene.add(
            this.pointLight,
            this.pointLightHelper
        );
    }

    createSpotLight() {
        this.spotLight = new SpotLight(0xeeeeee);
        this.spotLight.visible = false;
        this.spotLight.castShadow = true;
        this.spotLight.position.set(0, 5, 0);
        this.spotLight.target = this.ground;
        this.spotLight.distance = 10; // 0 là vô hạn
        this.spotLight.angle = Math.PI * 0.1;
        this.spotLight.penumbra = 0.4;

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

    createRectAreaLight() {
        // Phải có cái này thì mới tạo bóng ở sàn được
        RectAreaLightUniformsLib.init();

        this.rectAreaLight = new RectAreaLight(0xff00ff, 5, 2, 5);
        this.rectAreaLight.position.set(0, 2.5, -2);
        this.rectAreaLight.visible = false;
        // this.rectAreaLight.lookAt(this.ground.position);
        this.rectAreaLight.lookAt(0, 2.5, 0);

        this.rectAreaLightHelper = new RectAreaLightHelper(this.rectAreaLight);
        this.rectAreaLight.add(this.rectAreaLightHelper);

        this.scene.add(this.rectAreaLight);
    }

    createControlsGui(selectedLight) {
        const controls = {
            ambientColor: this.ambientLight.color.getHex(),
            hemisphereColor: this.hemisphereLight.color.getHex(),
            hemisphereGroundColor: this.hemisphereLight.groundColor.getHex(),
            directionalColor: this.directionalLight.color.getHex(),
            directionalTarget: 'Ground',
            pointColor: this.pointLight.color.getHex(),
            spotColor: this.spotLight.color.getHex(),
            spotTarget: 'Ground',
            rectAreaColor: this.rectAreaLight.color.getHex()
        };

        const gui = new GUI();

        {
            const ambientFolder = gui.addFolder('AmbientLight');
            ambientFolder.add(this.ambientLight, 'visible');
            ambientFolder.add(this.ambientLight, 'intensity', 0, 3, 0.1);
            ambientFolder.addColor(controls, 'ambientColor')
                .name('color')
                .onChange(color => {
                    this.ambientLight.color.set(color);
                });
            if (selectedLight == 'Ambient') {
                ambientFolder.open();
            } else {
                ambientFolder.close();
            }
        }

        {
            const hemisphereFolder = gui.addFolder('HemisphereLight');
            hemisphereFolder.add(this.hemisphereLight, 'visible');
            hemisphereFolder.add(this.hemisphereLight, 'intensity', 0, 5);
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
            if (selectedLight == 'Hemisphere') {
                hemisphereFolder.open();
            } else {
                hemisphereFolder.close();
            }
        }

        {
            const directionalFolder = gui.addFolder('DirectionalLight');
            directionalFolder.add(this.directionalLight, 'visible');
            directionalFolder.add(this.directionalLight, 'intensity', 0, 5);
            directionalFolder.addColor(controls, 'directionalColor')
                .name('color')
                .onChange(color => {
                    this.directionalLight.color.set(color);
                });
            directionalFolder.add(this.directionalLight, 'castShadow');
            directionalFolder.add(this.directionalLightHelper, 'visible')
                .name('helper');
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
            // directionalFolder.add(this.directionalCameraHelper, 'visible').name('camera');
            if (selectedLight == 'Directional') {
                directionalFolder.open();
            } else {
                directionalFolder.close();
            }
        }

        {
            const pointFolder = gui.addFolder('PointLight');
            pointFolder.add(this.pointLight, 'visible');
            pointFolder.add(this.pointLight, 'intensity', 0, 3);
            pointFolder.addColor(controls, 'pointColor')
                .name('color')
                .onChange(color => {
                    this.pointLight.color.set(color);
                });
            pointFolder.add(this.pointLight, 'castShadow');
            pointFolder.add(this.pointLightHelper, 'visible')
                .name('helper');
            pointFolder.add(this.pointLight, 'distance', 0, 12); // 0 là vô hạn
            if (selectedLight == 'Point') {
                pointFolder.open();
            } else {
                pointFolder.close();
            }
        }

        {
            const spotFolder = gui.addFolder('SpotLight');
            spotFolder.add(this.spotLight, 'visible');
            spotFolder.add(this.spotLight, 'intensity', 0, 5);
            spotFolder.addColor(controls, 'spotColor')
                .name('color')
                .onChange(color => {
                    this.spotLight.color.set(color);
                });
            spotFolder.add(this.spotLight, 'castShadow');
            spotFolder.add(this.spotLightHelper, 'visible')
                .name('helper');
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
            spotFolder.add(this.spotLight, 'distance', 0, 20);
            spotFolder.add(this.spotLight, 'angle', 0, Math.PI);
            spotFolder.add(this.spotLight, 'penumbra', 0, 1);
            // spotFolder.add(this.spotCameraHelper, 'visible').name('camera');
            if (selectedLight == 'Spot') {
                spotFolder.open();
            } else {
                spotFolder.close();
            }
        }

        {
            const rectAreaFolder = gui.addFolder('RectAreaLight');
            rectAreaFolder.add(this.rectAreaLight, 'visible');
            rectAreaFolder.add(this.rectAreaLight, 'intensity', 0, 70);
            /*
            rectAreaFolder.addColor(controls, 'rectAreaColor')
                .name('color')
                .onChange(color => {
                    this.rectAreaLight.color.set(color);
                });
            */
            rectAreaFolder.addColor(new ColorGUIHelper(this.rectAreaLight, 'color'), 'value')
                .name('color');
            rectAreaFolder.add(this.rectAreaLight, 'width', 1, 20);
            rectAreaFolder.add(this.rectAreaLight, 'height', 1, 20);
            rectAreaFolder.add(new DegRadHelper(this.rectAreaLight.rotation, 'x'), 'value', -180, 180)
                .name('x rotation');
            rectAreaFolder.add(new DegRadHelper(this.rectAreaLight.rotation, 'y'), 'value', -180, 180)
                .name('y rotation');
            rectAreaFolder.add(new DegRadHelper(this.rectAreaLight.rotation, 'z'), 'value', -180, 180)
                .name('z rotation');
            if (selectedLight == 'RectArea') {
                rectAreaFolder.open();
            } else {
                rectAreaFolder.close();
            }
        }

        // gui.close();
    }

    createOrbitControls() {
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

        this.directionalLightHelper.update();
        this.pointLightHelper.update();
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
        case 'Hemisphere':
            this.hemisphereLight.visible = true;
            break;
        case 'Directional':
            this.directionalLight.visible = true;
            this.directionalLightHelper.visible = true;
            // this.directionalCameraHelper.visible = true;
            break;
        case 'Point':
            this.pointLight.visible = true;
            this.pointLightHelper.visible = true;
            break;
        case 'Spot':
            this.spotLight.visible = true;
            this.spotLightHelper.visible = true;
            // this.spotCameraHelper.visible = true;
            break;
        case 'RectArea':
            this.rectAreaLight.visible = true;
            break;
        }
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
