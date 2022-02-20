const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();

let mesh;
let light;

function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(20, 20, 20);
    const material = new THREE.MeshLambertMaterial({ color: 0xfd59d7 });
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    camera.position.z = 100;

    light = new THREE.PointLight(0xFFFF00);
    light.position.set(10, 0, 25);
    scene.add(light);
}

function update() {
    mesh.rotation.x += 0.01;
    mesh.rotation.y += 0.01;
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
}

function setupDatGui() {
    const gui = new dat.GUI();

    // Camera
    const cameraPositionGui = gui.addFolder('camera position');
    cameraPositionGui.add(camera.position, 'x');
    cameraPositionGui.add(camera.position, 'y');
    cameraPositionGui.add(camera.position, 'z');
    cameraPositionGui.open();

    const cameraProjectionGui = gui.addFolder('camera projection');
    cameraProjectionGui.add(camera, 'fov');
    cameraProjectionGui.open();

    // Light
    const lightPositionGui = gui.addFolder('light position');
    lightPositionGui.add(light.position, 'x');
    lightPositionGui.add(light.position, 'y');
    lightPositionGui.add(light.position, 'z');
    lightPositionGui.open();

    // Cube
    const cubePositionGui = gui.addFolder('cube position');
    cubePositionGui.add(mesh.position, 'x');
    cubePositionGui.add(mesh.position, 'y');
    cubePositionGui.add(mesh.position, 'z');
    cubePositionGui.open();
}


init();
animate();
setupDatGui();
