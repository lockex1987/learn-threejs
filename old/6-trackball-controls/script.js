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
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const controls = new THREE.TrackballControls(camera, renderer.domElement);


function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();
