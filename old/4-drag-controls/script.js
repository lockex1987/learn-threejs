const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the shape
const geometry = new THREE.SphereGeometry(1, 8, 5); // size of box
const geometry2 = new THREE.ConeGeometry(1, 1.5, 3); // add second box

// create material, color or image
const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true }); // wireframe false will not show wireframe
const sphere = new THREE.Mesh(geometry, material);
const cone = new THREE.Mesh(geometry2, material);

sphere.position.x = -2;
sphere.position.y = 1;
sphere.position.z = -2;

scene.add(sphere);
scene.add(cone);

camera.position.z = 3;

// game login
const update = function () {

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

// drag control:
const controls = new THREE.DragControls([sphere, cone], camera, renderer.domElement);
