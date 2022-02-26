import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    PlaneGeometry,
    MeshNormalMaterial,
    MeshBasicMaterial,
    Mesh,
    AxesHelper
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import * as dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera(canvas);
        this.renderer = this.createRenderer(canvas);

        this.plane = this.createPlane();
        this.scene.add(this.plane);

        const axesHelper = new AxesHelper(15);
        this.scene.add(axesHelper);

        const cube = this.createCube();
        this.scene.add(cube);

        requestAnimationFrame(this.render.bind(this));
        this.handleResize();

        this.controls = this.createControls(this.scene, this.createCube);
        this.createControlsGui();
    }

    createScene() {
        const scene = new Scene();
        return scene;
    }

    createCamera(canvas) {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;
        const camera = new PerspectiveCamera(45, aspect, 0.1, 1000);
        camera.position.set(-30, 40, 30);
        camera.lookAt(this.scene.position);

        camera.tick = ms => {
            // Tính góc xoay theo thời gian
            // Xoay một vòng hết 16 giây
            const seconds = ms / 1000;
            const angle = seconds * Math.PI / 8;

            // Sử dụng các hàm sin và cos để di chuyển vòng tròn
            camera.position.x = 30 * Math.sin(angle);
            camera.position.z = 30 * Math.cos(angle);

            // Luôn nhìn vào điểm trung tâm
            camera.lookAt(this.scene.position);
        };

        return camera;
    }

    createRenderer(canvas) {
        const renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        renderer.setClearColor(new Color(0x000000));
        const pixelRatio = window.devicePixelRatio;
        const width = canvas.clientWidth * pixelRatio;
        const height = canvas.clientHeight * pixelRatio;
        renderer.setSize(width, height, false);
        return renderer;
    }

    createCube() {
        const cubeSize = Math.ceil((Math.random() * 3));
        const cubeGeometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMaterial = new MeshNormalMaterial();
        const cube = new Mesh(cubeGeometry, cubeMaterial);

        // Thiết lập vị trí ngẫu nhiên
        cube.position.x = -15 + Math.round((Math.random() * 30));
        cube.position.y = 5 + Math.round((Math.random() * 5));
        cube.position.z = -10 + Math.round((Math.random() * 20));

        cube.tick = ms => {
            cube.rotation.y = ms * Math.PI / 1000;
        };

        return cube;
    }

    createPlane() {
        const planeGeometry = new PlaneGeometry(30, 20, 1, 1);
        const planeMaterial = new MeshBasicMaterial({
            // color: 0xDDDDDDD
            color: new Color('rgb(106, 193, 116)')
        });

        planeMaterial.opacity = 0.4; // không ăn, phải thêm transparent bằng true
        planeMaterial.transparent = true;

        const planeMesh = new Mesh(planeGeometry, planeMaterial);
        planeMesh.rotation.x = -0.5 * Math.PI;
        planeMesh.position.x = 0;
        planeMesh.position.y = -1;
        planeMesh.position.z = 0;
        return planeMesh;
    }

    createControls(scene, createCubeFunc) {
        // Chú ý đối tượng this ở đây
        const controls = {
            numberOfObjects: scene.children.length,

            rotateCamera: false,

            removeCube() {
                const allObjects = scene.children;
                const lastObject = allObjects[allObjects.length - 1];
                if (lastObject instanceof Mesh) {
                    scene.remove(lastObject);
                    this.numberOfObjects = scene.children.length;
                }
            },

            addCube() {
                const cube = createCubeFunc();
                scene.add(cube);
                this.numberOfObjects = scene.children.length;
            }
        };
        return controls;
    }

    createControlsGui() {
        const gui = new dat.GUI({
            // width: 500
        });
        gui.add(this.controls, 'addCube');
        gui.add(this.controls, 'removeCube');
        gui.add(this.controls, 'numberOfObjects')
            .listen()
            .name('Số đối tượng');
        gui.add(this.controls, 'rotateCamera');

        gui.add(this.plane.rotation, 'x', -2 * Math.PI, 2 * Math.PI, 0.01)
            .name('Mặt phẳng');

        // Camera
        const size = 100;
        const cameraPositionGui = gui.addFolder('Camera position');
        cameraPositionGui.add(this.camera.position, 'x', -size, size);
        cameraPositionGui.add(this.camera.position, 'y', -size, size);
        cameraPositionGui.add(this.camera.position, 'z', -size, size);
        cameraPositionGui.open();

        const cameraProjectionGui = gui.addFolder('Camera projection');
        cameraProjectionGui.add(this.camera, 'fov', 0, 100)
            .onChange(value => {
                this.camera.updateProjectionMatrix();
            });
        cameraProjectionGui.open();
    }

    update(ms) {
        this.scene.traverse(obj => {
            if (obj instanceof Mesh && obj != this.plane) {
                obj.tick(ms);
            }
        });

        if (this.controls.rotateCamera) {
            this.camera.tick(ms);
        }
    }

    render(ms) {
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
    }
}


window.addEventListener('load', () => {
    new ThreejsExample(document.querySelector('#webglOutput'));
});
