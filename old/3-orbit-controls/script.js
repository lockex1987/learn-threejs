const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the shape
const geometry = new THREE.SphereGeometry(1, 8, 5); // size of box

// create material, color or image
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); // wireframe false will not show wireframe
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 3;

// game login
const update = function () {
    // Just for fun
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.005;
};

// draw scene
const render = function () {
    renderer.render(scene, camera);
};

// run gameloop (update, render, repeat)
const GameLoop = function () {
    requestAnimationFrame(GameLoop);
    update();
    render();
};

GameLoop();

// Just for fun
scene.background = new THREE.Color('skyblue');

// orbit control:
const controls = new THREE.OrbitControls(camera, renderer.domElement);
