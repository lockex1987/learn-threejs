function init() {
    // use the defaults
    const stats = initStats();
    const renderer = initRenderer();

    const camera = initCamera();
    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    // add a simple scene
    addHouseAndTree(scene);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight('#0c0c0c');
    scene.add(ambientLight);

    // The point light where working with
    const pointColor = '#ccffcc';
    const pointLight = new THREE.PointLight(pointColor);
    pointLight.decay = 0.1;
    pointLight.castShadow = true;
    scene.add(pointLight);

    const helper = new THREE.PointLightHelper(pointLight);
    // scene.add(helper);

    const shadowHelper = new THREE.CameraHelper(pointLight.shadow.camera);
    // scene.add(shadowHelper);

    // add a small sphere simulating the pointlight
    const sphereGeometry = new THREE.SphereGeometry(0.2);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xac6c25
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position = new THREE.Vector3(3, 0, 5);
    scene.add(sphereMesh);

    // used to determine the switch point for the light animation
    let invert = 1;
    let phase = 0;

    const controls = setupControls();
    render();

    function render() {
        helper.update();
        shadowHelper.update();

        stats.update();
        pointLight.position.copy(sphereMesh.position);
        trackballControls.update(clock.getDelta());

        // move the light simulation
        if (phase > 2 * Math.PI) {
            invert = invert * -1;
            phase -= 2 * Math.PI;
        } else {
            phase += controls.rotationSpeed;
        }
        sphereMesh.position.z = +(25 * (Math.sin(phase)));
        sphereMesh.position.x = +(14 * (Math.cos(phase)));
        sphereMesh.position.y = 5;

        if (invert < 0) {
            const pivot = 14;
            sphereMesh.position.x = (invert * (sphereMesh.position.x - pivot)) + pivot;
        }

        // Render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function setupControls() {
        const controls = new function () {
            this.rotationSpeed = 0.01;
            this.bouncingSpeed = 0.03;
            this.ambientColor = ambientLight.color.getStyle(); ;
            this.pointColor = pointLight.color.getStyle(); ;
            this.intensity = 1;
            this.distance = pointLight.distance;
        }();

        const gui = new dat.GUI();
        gui.addColor(controls, 'ambientColor').onChange(function (e) {
            ambientLight.color = new THREE.Color(e);
        });

        gui.addColor(controls, 'pointColor').onChange(function (e) {
            pointLight.color = new THREE.Color(e);
        });

        gui.add(controls, 'distance', 0, 100).onChange(function (e) {
            pointLight.distance = e;
        });

        gui.add(controls, 'intensity', 0, 3).onChange(function (e) {
            pointLight.intensity = e;
        });

        return controls;
    }
}


init();
