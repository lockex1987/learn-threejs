const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry1 = new THREE.SphereGeometry(1, 8, 5);
const geometry2 = new THREE.ConeGeometry(1, 1.5, 3);


const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const sphere = new THREE.Mesh(geometry1, material);
const cone = new THREE.Mesh(geometry2, material);

sphere.position.x = -2;
sphere.position.y = 1;
sphere.position.z = -2;

scene.add(sphere);
scene.add(cone);

const controls = new THREE.DragControls([sphere, cone], camera, renderer.domElement);

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

render();
