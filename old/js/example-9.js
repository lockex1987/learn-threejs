const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// add cube
const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshNormalMaterial();
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// update cube vertices
console.log(geometry);
for (let i = 0, l = geometry.vertices.length; i < l; i++) {
    geometry.vertices[i].x += -10 + Math.random() * 20;
    geometry.vertices[i].y += -10 + Math.random() * 20;
}

// rotate cube
cube.rotation.x = 0.45;
cube.rotation.y = -0.25;

camera.position.z = 100;

const light = new THREE.PointLight(0xFFFF00);
light.position.set(10, 0, 25);
scene.add(light);


function update() {
    cube.rotation.x += 0.05;
}


function render() {
    update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


render();
