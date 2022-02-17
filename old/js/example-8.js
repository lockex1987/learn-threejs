const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add cube
const geometry = new THREE.IcosahedronGeometry(10, 0);
const material = new THREE.MeshNormalMaterial();
const icosahedron = new THREE.Mesh(geometry, material);
scene.add(icosahedron);

// rotate cube
icosahedron.rotation.x = 0.1;
icosahedron.rotation.y = -0.25;

const light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 25);
scene.add(light);


function update() {
    icosahedron.rotation.x += 0.05;
}


function render() {
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();
