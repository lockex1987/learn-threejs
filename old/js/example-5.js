const scene = new THREE.Scene();
scene.background = new THREE.Color('skyblue');

// Camera
const fov = 75; // degree
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;

// OrthographicCamera vs OrthographicCamera
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 3;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the shape
const geometry = new THREE.SphereGeometry(1, 8, 5); // size of box

// Create material, color or image
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
}); // wireframe false will not show wireframe
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


function update() {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.005;
}


function render() {
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();
