function init() {
    const scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshDepthMaterial();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
    camera.position.set(-50, 40, 50);
    camera.lookAt(scene.position);

    const renderer = initRenderer();

    const controls = new function () {
        this.cameraNear = camera.near;
        this.cameraFar = camera.far;

        this.addCube = function () {
            const cubeSize = Math.ceil(3 + (Math.random() * 3));
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            // const cubeMaterial = new THREE.MeshDepthMaterial();
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            // cube.castShadow = true;

            // position the cube randomly in the scene
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            // add the cube to the scene
            scene.add(cube);
        };
    }();

    const gui = new dat.GUI();
    // addBasicMaterialSettings(gui, controls, scene.overrideMaterial);
    const spGui = gui.addFolder('THREE.MeshDepthMaterial');
    spGui.add(scene.overrideMaterial, 'wireframe');
    gui.add(controls, 'addCube');
    gui.add(controls, 'cameraNear', 0, 100).onChange(function (e) {
        camera.near = e;
        camera.updateProjectionMatrix();
    });
    gui.add(controls, 'cameraFar', 50, 200).onChange(function (e) {
        camera.far = e;
        camera.updateProjectionMatrix();
    });

    let i = 0;
    while (i < 10) {
        controls.addCube();
        i++;
    }

    function render() {
        // rotate the cubes around its axes
        const rotationSpeed = 0.02;
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh) {
                e.rotation.x += rotationSpeed;
                e.rotation.y += rotationSpeed;
                e.rotation.z += rotationSpeed;
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}


init();
