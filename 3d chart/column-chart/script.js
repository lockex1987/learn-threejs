const red = 0xff0000;
const blue = 0x1176c5;
const white = 0xf9f9f9;
const bar = [];
let scene, camera, renderer;


function init() {
    initListeners();
    init3DScene();
}


function initListeners() {
    $(window).resize(onWindowResize);
}


function init3DScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 2000);

    camera.position.set(100, 100, 100);
    camera.lookAt(new THREE.Vector3(20, 40, 0));

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    $('#webGL-container').append(renderer.domElement);

    init3DElements();
}


function init3DElements() {
    createFloor();
    createBar(5, -25, red);
    createBar(5, -20, red);
    createBar(5, -15, white);
    createBar(5, -10, white);
    createBar(5, -5, blue);
    createBar(5, 0, blue);
    createLight();
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


function createLight() {
    const ambient = new THREE.AmbientLight(0x999999);
    const spot = new THREE.SpotLight({
        color: 0xffffff,
        intensity: 0.1
    });
    spot.position.set(-50, 100, 100);
    spot.castShadow = true;
    spot.shadowDarkness = 0.2;
    scene.add(ambient, spot);
}


function createBar(total, z, colour) {
    for (let i = 0; i < total; i += 1) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 1, z));

        const material = new THREE.MeshPhongMaterial({
            color: colour
        });

        const id = new THREE.Mesh(geometry, material);
        id.position.x = i * 5;
        id.name = 'bar-' + i;
        id.castShadow = true;
        id.receiveShadow = true;

        scene.add(id);
        bar.push(id);
    }

    for (let i = 0; i < bar.length; i++) {
        const tween = new TweenMax.to(bar[i].scale, 1, {
            ease: Elastic.easeOut.config(1, 1),
            y: Math.random() * 30 /* i+1 */,
            delay: i * 0.25
        });
    }
}


function createFloor() {
    const geometry = new THREE.BoxGeometry(2000, 2000, 2000);
    const material = new THREE.MeshPhongMaterial({
        color: 0xcccccc,
        shininess: 20
    });
    material.side = THREE.BackSide;
    const floor = new THREE.Mesh(geometry, material);
    floor.position.set(0, 1000, 0);
    floor.rotation.x = THREE.Math.degToRad(-90);
    floor.receiveShadow = true;
    scene.add(floor);
}


function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};


init();
render();
