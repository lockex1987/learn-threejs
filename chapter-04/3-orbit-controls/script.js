const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(1, 8, 5);
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

function update() {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.005;
}

function render() {
    // Required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
