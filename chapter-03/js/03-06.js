function init() {
    // use the defaults
    const stats = initStats();
    const renderer = initRenderer();
    const camera = initCamera();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    const groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({
        color: 0x555555
    }));
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -20;
    scene.add(groundMesh);

    const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


    const meshMaterial = new THREE.MeshLambertMaterial({
        color: 0x7777ff
    });
    const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    const plane = new THREE.Mesh(planeGeometry, meshMaterial);

    let selectedMesh = cube;

    // position the sphere
    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;

    cube.position = sphere.position;
    plane.position = sphere.position;

    // add the sphere to the scene
    scene.add(cube);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-30, 60, 60);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // call the render function
    let step = 0;

    const controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        this.opacity = meshMaterial.opacity;
        this.transparent = meshMaterial.transparent;
        this.overdraw = meshMaterial.overdraw;
        this.visible = meshMaterial.visible;
        this.emissive = meshMaterial.emissive.getHex();

        // this.ambient = meshMaterial.ambient.getHex();
        this.side = 'front';

        this.color = meshMaterial.color.getStyle();
        this.wrapAround = false;
        this.wrapR = 1;
        this.wrapG = 1;
        this.wrapB = 1;

        this.selectedMesh = 'cube';
    }();

    const gui = new dat.GUI();
    addBasicMaterialSettings(gui, controls, meshMaterial);
    const spGui = gui.addFolder('THREE.MeshLambertMaterial');
    spGui.addColor(controls, 'color').onChange(function (e) {
        meshMaterial.color.setStyle(e);
    });
    spGui.addColor(controls, 'emissive').onChange(function (e) {
        meshMaterial.emissive = new THREE.Color(e);
    });
    spGui.add(meshMaterial, 'wireframe');
    spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);


    loadGopher(meshMaterial).then(function (gopher) {
        gopher.scale.x = 4;
        gopher.scale.y = 4;
        gopher.scale.z = 4;
        gui.add(controls, 'selectedMesh', ['cube', 'sphere', 'plane', 'gopher']).onChange(function (e) {
            scene.remove(plane);
            scene.remove(cube);
            scene.remove(sphere);
            scene.remove(gopher);

            switch (e) {
            case 'cube':
                scene.add(cube);
                selectedMesh = cube;
                break;
            case 'sphere':
                scene.add(sphere);
                selectedMesh = sphere;
                break;
            case 'plane':
                scene.add(plane);
                selectedMesh = plane;
                break;
            case 'gopher':
                scene.add(gopher);
                selectedMesh = gopher;
                break;
            }
        });
    });

    render();

    function render() {
        stats.update();

        selectedMesh.rotation.y = step += 0.01;

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}


init();
