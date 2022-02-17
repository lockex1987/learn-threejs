import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    BoxGeometry,
    ConeGeometry,
    CylinderGeometry,
    SphereGeometry,
    PlaneGeometry,
    MeshLambertMaterial,
    Mesh,
    SpotLight,
    AmbientLight,
    Vector2
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';


/**
 * r65 → r66: Renamed CubeGeometry to BoxGeometry.
 */
class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);

        const cube = this.createCube();
        this.scene.add(cube);

        const sphere = this.createSphere();
        this.scene.add(sphere);

        const plane = this.createPlane();
        this.scene.add(plane);

        this.createBoundingWall(this.scene);
        this.createGroundPlane(this.scene);
        this.createHouse(this.scene);
        this.createTree(this.scene);

        const spotLight = this.createSpotLight();
        this.scene.add(spotLight);

        const ambienLight = this.createAmbientLight();
        this.scene.add(ambienLight);

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
            canvas,
            antialias: true
        });
        renderer.setClearColor(new Color(0x000000));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        return renderer;
    }

    createCube() {
        const cubeGeometry = new BoxGeometry(4, 4, 4);
        const cubeMaterial = new MeshLambertMaterial({
            color: 0xFF0000
        });
        const cube = new Mesh(cubeGeometry, cubeMaterial);
        cube.castShadow = true;

        cube.position.x = -4;
        cube.position.y = 2;
        cube.position.z = 0;

        return cube;
    }

    createSphere() {
        const sphereGeometry = new SphereGeometry(4, 20, 20);
        const sphereMaterial = new MeshLambertMaterial({
            color: 0x7777ff
        });
        const sphere = new Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;

        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;

        return sphere;
    }

    createPlane() {
        const planeGeometry = new PlaneGeometry(60, 20);
        const planeMaterial = new MeshLambertMaterial({
            color: 0xAAAAAA
        });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(15, 0, 0);
        return plane;
    }

    createBoundingWall(scene) {
        const wallLeft = new BoxGeometry(70, 2, 2);
        const wallRight = new BoxGeometry(70, 2, 2);
        const wallTop = new BoxGeometry(2, 2, 50);
        const wallBottom = new BoxGeometry(2, 2, 50);

        const wallMaterial = new MeshLambertMaterial({
            color: 0xa0522d
        });

        const wallLeftMesh = new Mesh(wallLeft, wallMaterial);
        const wallRightMesh = new Mesh(wallRight, wallMaterial);
        const wallTopMesh = new Mesh(wallTop, wallMaterial);
        const wallBottomMesh = new Mesh(wallBottom, wallMaterial);

        wallLeftMesh.position.set(15, 1, -25);
        wallRightMesh.position.set(15, 1, 25);
        wallTopMesh.position.set(-19, 1, 0);
        wallBottomMesh.position.set(49, 1, 0);

        scene.add(wallLeftMesh);
        scene.add(wallRightMesh);
        scene.add(wallBottomMesh);
        scene.add(wallTopMesh);
    }

    createGroundPlane(scene) {
        // Create the ground plane
        const planeGeometry = new PlaneGeometry(70, 50);
        const planeMaterial = new MeshLambertMaterial({
            color: 0x9acd32
        });
        const plane = new Mesh(planeGeometry, planeMaterial);
        plane.receiveShadow = true;

        // Rotate and position the plane
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.x = 15;
        plane.position.y = 0;
        plane.position.z = 0;

        scene.add(plane);
    }

    createHouse(scene) {
        const roof = new ConeGeometry(5, 4);
        const base = new CylinderGeometry(5, 5, 6);

        // Create the mesh
        const roofMesh = new Mesh(roof, new MeshLambertMaterial({
            color: 0x8b7213
        }));
        const baseMesh = new Mesh(base, new MeshLambertMaterial({
            color: 0xffe4c4
        }));

        roofMesh.position.set(25, 8, 0);
        baseMesh.position.set(25, 3, 0);

        roofMesh.receiveShadow = true;
        baseMesh.receiveShadow = true;
        roofMesh.castShadow = true;
        baseMesh.castShadow = true;

        scene.add(roofMesh);
        scene.add(baseMesh);
    }

    createTree(scene) {
        const trunk = new BoxGeometry(1, 8, 1);
        const leaves = new SphereGeometry(4);

        // Create the mesh
        const trunkMesh = new Mesh(trunk, new MeshLambertMaterial({
            color: 0x8b4513
        }));
        const leavesMesh = new Mesh(leaves, new MeshLambertMaterial({
            color: 0x00ff00
        }));

        // Position the trunk. Set y to half of height of trunk
        trunkMesh.position.set(-10, 4, 0);
        leavesMesh.position.set(-10, 12, 0);

        trunkMesh.castShadow = true;
        trunkMesh.receiveShadow = true;
        leavesMesh.castShadow = true;
        leavesMesh.receiveShadow = true;

        scene.add(trunkMesh);
        scene.add(leavesMesh);
    }

    /**
     * Add spotlight for the shadows.
     */
    createSpotLight() {
        const spotLight = new SpotLight(0xFFFFFF);
        spotLight.position.set(-40, 40, -15);
        spotLight.castShadow = true;

        spotLight.shadow.mapSize = new Vector2(1024, 1024);
        spotLight.shadow.camera.far = 130;
        spotLight.shadow.camera.near = 40;

        // If you want a more detailled shadow you can increase the
        // mapSize used to draw the shadows
        // spotLight.shadow.mapSize = new Vector2(1024, 1024);

        return spotLight;
    }

    createAmbientLight() {
        const ambienLight = new AmbientLight(0x353535);
        return ambienLight;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
