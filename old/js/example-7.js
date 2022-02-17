const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer({
    // antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add cube
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Rotate cube
cube.rotation.x = 0.45;
cube.rotation.y = -0.25;

// Shift cube on the x axis
// cube.position.x = -30;

const light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 25);
scene.add(light);


function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();
