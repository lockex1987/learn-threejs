function init() {
    const renderer = initRenderer();
    const camera = initCamera();
    camera.position.set(-80, 80, 80);

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    const scene = new THREE.Scene();

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(600, 200, 20, 20);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = -5;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // create a cube
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({
        color: 0xff3333
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.castShadow = true;

    // position the cube
    cube.position.x = -4;
    cube.position.y = 3;
    cube.position.z = 0;

    // add the cube to the scene
    scene.add(cube);

    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    // position the sphere
    sphere.position.x = 20;
    sphere.position.y = 0;
    sphere.position.z = 2;
    sphere.castShadow = true;

    // add the sphere to the scene
    scene.add(sphere);

    // add subtle ambient lighting
    const ambiColor = '#1c1c1c';
    const ambientLight = new THREE.AmbientLight(ambiColor);
    scene.add(ambientLight);

    const pointColor = '#ff5808';
    const directionalLight = new THREE.DirectionalLight(pointColor);
    directionalLight.intensity = 0.5;
    directionalLight.position.set(-40, 60, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 2;
    directionalLight.shadow.camera.far = 80;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);

    const shadowCamera = new THREE.CameraHelper(directionalLight.shadow.camera);

    // add a small sphere simulating the pointlight
    const sphereLight = new THREE.SphereGeometry(0.2);
    const sphereLightMaterial = new THREE.MeshBasicMaterial({
        color: 0xac6c25
    });
    const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial);
    sphereLightMesh.castShadow = true;

    sphereLightMesh.position = new THREE.Vector3(3, 20, 3);
    scene.add(sphereLightMesh);

    // call the render function
    let step = 0;

    const controls = new function () {
        this.rotationSpeed = 0.03;
        this.bouncingSpeed = 0.03;
        this.ambientColor = ambiColor;
        this.pointColor = pointColor;
        this.intensity = 0.5;
        this.debug = false;
        this.castShadow = true;
        this.onlyShadow = false;
        this.target = 'Plane';
    }();

    const gui = new dat.GUI();

    gui.addColor(controls, 'ambientColor').onChange(function (e) {
        ambientLight.color = new THREE.Color(e);
    });
    gui.addColor(controls, 'pointColor').onChange(function (e) {
        directionalLight.color = new THREE.Color(e);
    });
    gui.add(controls, 'intensity', 0, 5).onChange(function (e) {
        directionalLight.intensity = e;
    });
    gui.add(controls, 'debug').onChange(function (e) {
        e ? scene.add(shadowCamera) : scene.remove(shadowCamera);
    });
    gui.add(controls, 'castShadow').onChange(function (e) {
        directionalLight.castShadow = e;
    });
    gui.add(controls, 'onlyShadow').onChange(function (e) {
        directionalLight.onlyShadow = e;
    });
    gui.add(controls, 'target', ['Plane', 'Sphere', 'Cube']).onChange(function (e) {
        console.log(e);
        switch (e) {
        case 'Plane':
            directionalLight.target = plane;
            break;
        case 'Sphere':
            directionalLight.target = sphere;
            break;
        case 'Cube':
            directionalLight.target = cube;
            break;
        }
    });

    function render() {
        trackballControls.update(clock.getDelta());

        // rotate the cube around its axes
        cube.rotation.x += controls.rotationSpeed;
        cube.rotation.y += controls.rotationSpeed;
        cube.rotation.z += controls.rotationSpeed;

        // bounce the sphere up and down
        step += controls.bouncingSpeed;
        sphere.position.x = 20 + (10 * (Math.cos(step)));
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        sphereLightMesh.position.z = -8;
        sphereLightMesh.position.y = +(27 * (Math.sin(step / 3)));
        sphereLightMesh.position.x = 10 + (26 * (Math.cos(step / 3)));

        directionalLight.position.copy(sphereLightMesh.position);

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}


init();
