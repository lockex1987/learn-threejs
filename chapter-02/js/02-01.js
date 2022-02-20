function init() {
    const stats = initStats();

    // Create a scene, that will hold all our elements such as objects, cameras and lights
    const scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);

    // create a render and set the size
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // Add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // Add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);

    // Add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, 120);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // Add the output of the renderer to the html element
    document.getElementById('webgl-output')
        .appendChild(renderer.domElement);

    const controls = {
        rotationSpeed: 0.02,
        numberOfObjects: scene.children.length,

        removeCube() {
            const allChildren = scene.children;
            const lastObject = allChildren[allChildren.length - 1];
            // Avoid removing the lights
            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject);
                this.numberOfObjects = scene.children.length;
            }
        },

        addCube() {
            const cubeSize = Math.ceil((Math.random() * 3));
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cubeMaterial = new THREE.MeshLambertMaterial({
                color: Math.random() * 0xffffff
            });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.name = 'cube-' + scene.children.length;

            // Position the cube randomly in the scene
            cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
            cube.position.y = Math.round((Math.random() * 5));
            cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));

            // Add the cube to the scene
            scene.add(cube);

            this.numberOfObjects = scene.children.length;
        },

        outputObjects() {
            console.log(scene.children);
        }
    };

    const gui = new dat.GUI();
    gui.add(controls, 'rotationSpeed', 0, 0.5);
    gui.add(controls, 'addCube');
    gui.add(controls, 'removeCube');
    gui.add(controls, 'outputObjects');
    gui.add(controls, 'numberOfObjects').listen();

    // attach them here, since appendChild needs to be called first
    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    render();

    function render() {
        trackballControls.update(clock.getDelta());
        stats.update();

        // Rotate the cubes around its axes
        scene.traverse(obj => {
            if (obj instanceof THREE.Mesh && obj != plane) {
                obj.rotation.x += controls.rotationSpeed;
                obj.rotation.y += controls.rotationSpeed;
                obj.rotation.z += controls.rotationSpeed;
            }
        });

        // Render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
