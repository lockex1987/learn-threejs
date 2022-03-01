function init() {
    // use the defaults
    const stats = initStats();
    const renderer = initRenderer();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();
    scene.overrideMaterial = new THREE.MeshDepthMaterial();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 50, 110);
    camera.position.set(-50, 40, 50);
    camera.lookAt(scene.position);


    // call the render function
    const step = 0;

    const controls = new function () {
        this.cameraNear = camera.near;
        this.cameraFar = camera.far;
        this.rotationSpeed = 0.02;
        this.numberOfObjects = scene.children.length;

        this.removeCube = function () {
            const allChildren = scene.children;
            const lastObject = allChildren[allChildren.length - 1];
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        };

        this.addCube = function () {
            const cubeSize = Math.ceil(3 + (Math.random() * 3));
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;

            // position the cube randomly in the scene
            cube.position.x = -60 + Math.round((Math.random() * 100));
            cube.position.y = Math.round((Math.random() * 10));
            cube.position.z = -100 + Math.round((Math.random() * 150));

            // add the cube to the scene
            scene.add(cube);
            this.numberOfObjects = scene.children.length;
        };

        this.outputObjects = function () {
            console.log(scene.children);
        };
    }();

    const gui = new dat.GUI();
    addBasicMaterialSettings(gui, controls, scene.overrideMaterial);
    const spGui = gui.addFolder('THREE.MeshDepthMaterial');
    spGui.add(scene.overrideMaterial, 'wireframe');
    spGui.add(scene.overrideMaterial, 'wireframeLinewidth', 0, 20);

    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
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


    render();

    function render() {
        stats.update();

        // rotate the cubes around its axes
        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}


init();
