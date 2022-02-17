const scene = new THREE.Scene();

const playerCar = Car();
scene.add(playerCar);

// set up light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(200, 500, 300);
scene.add(dirLight);

// Set up camera
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
    cameraWidth / -2, // left
    cameraWidth / 2, // right
    cameraHeight / 2, // top
    cameraHeight / -2, // bottom
    0, // near plane
    1000 // far plane
);
camera.position.set(200, 200, 200);
camera.up.set(0, 0, 1);
camera.lookAt(0, 10, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);


function Car() {
    const car = new THREE.Group();
    const backWheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    backWheel.position.y = 6;
    backWheel.position.x = -18;
    car.add(backWheel);

    const frontWheel = new THREE.Mesh(
        new THREE.BoxBufferGeometry(12, 33, 12),
        new THREE.MeshLambertMaterial({ color: 0x333333 })
    );

    frontWheel.position.y = 6;
    frontWheel.position.x = 18;
    car.add(frontWheel);

    const main = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60, 30, 15),
        new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    main.position.z = 6;
    main.position.y = 6;
    car.add(main);

    const cabin = new THREE.Mesh(
        new THREE.BoxBufferGeometry(33, 30, 12),
        new THREE.MeshLambertMaterial({ color: 0xa52523 })
    );
    cabin.position.y = 6;
    cabin.position.z = 20;
    car.add(cabin);

    return car;
}

// define texture
function getCarSideTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;

    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = '#666666';
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}
