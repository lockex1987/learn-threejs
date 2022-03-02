function addLights(scene) {
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
}



function init() {
    const scene = new THREE.Scene();

    const camera = initCamera();

    const renderer = initRenderer();

    const group = new THREE.Mesh();
    // add all the rubik cube elements
    const mats = [];
    mats.push(new THREE.MeshBasicMaterial({ color: 0x009e60 }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0x0051ba }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffd500 }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xff5800 }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xC41E3A }));
    mats.push(new THREE.MeshBasicMaterial({ color: 0xffffff }));

    const cubeGeom = new THREE.BoxGeometry(2.9, 2.9, 2.9);
    for (let x = 0; x < 3; x++) {
        for (let y = 0; y < 3; y++) {
            for (let z = 0; z < 3; z++) {
                const cube = new THREE.Mesh(cubeGeom, mats);
                cube.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3);
                group.add(cube);
            }
        }
    }
    group.scale.copy(new THREE.Vector3(2, 2, 2));
    scene.add(group);

    let step = 0;

    function render() {
        const rotationSpeed = 0.01;
        group.rotation.y = step += rotationSpeed;
        group.rotation.z = step -= rotationSpeed;
        group.rotation.x = step += rotationSpeed;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}


init();
