function init() {
    const stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    // Create a camera, which defines where we're looking at
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 120;
    camera.position.y = 60;
    camera.position.z = 180;

    // create a render and set the size
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(180, 180);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);


    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    for (let j = 0; j < (planeGeometry.parameters.height / 5); j++) {
        for (let i = 0; i < planeGeometry.parameters.width / 5; i++) {
            const rnd = Math.random() * 0.75 + 0.25;
            const cubeMaterial = new THREE.MeshLambertMaterial();
            cubeMaterial.color = new THREE.Color(rnd, 0, 0);
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

            cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + (j * 5);
            cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + (i * 5);
            cube.position.y = 2;

            scene.add(cube);
        }
    }

    const lookAtGeom = new THREE.SphereGeometry(2);
    const lookAtMesh = new THREE.Mesh(lookAtGeom, new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
    scene.add(lookAtMesh);


    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(-20, 40, 60);
    scene.add(directionalLight);


    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x292929);
    scene.add(ambientLight);

    // add the output of the renderer to the html element
    document.getElementById('webgl-output').appendChild(renderer.domElement);

    // call the render function
    let step = 0;

    const controls = new function () {
        this.perspective = 'Perspective';
        this.switchCamera = function () {
            if (camera instanceof THREE.PerspectiveCamera) {
                camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;

                camera.lookAt(scene.position);
                this.perspective = 'Orthographic';
            } else {
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
                camera.position.x = 120;
                camera.position.y = 60;
                camera.position.z = 180;

                camera.lookAt(scene.position);
                this.perspective = 'Perspective';
            }
        };
    }();

    const gui = new dat.GUI();
    gui.add(controls, 'switchCamera');
    gui.add(controls, 'perspective').listen();

    // make sure that for the first time, the
    // camera is looking at the scene
    //   camera.lookAt(scene.position);
    render();

    function render() {
        stats.update();

        // render using requestAnimationFrame
        step += 0.02;
        if (camera instanceof THREE.Camera) {
            const x = 10 + (100 * (Math.sin(step)));
            camera.lookAt(new THREE.Vector3(x, 10, 0));
            lookAtMesh.position.copy(new THREE.Vector3(x, 10, 0));
        }

        //        .position.x = 20+( 10*(Math.cos(step)));
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
