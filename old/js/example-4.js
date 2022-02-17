const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create the shape
const geometry = new THREE.SphereGeometry(1, 8, 5); // size of box

// create material, color or image
const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
}); // wireframe false will not show wireframe
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


function render() {
    renderer.render(scene, camera);
    // console.log(1);
    // requestAnimationFrame(render);
};

render();

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
});
