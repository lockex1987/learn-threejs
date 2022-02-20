function init() {
    const stats = initStats();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

    // create a render and set the size
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    // create the ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.x = -30;
    camera.position.y = 40;
    camera.position.z = 30;
    camera.lookAt(scene.position);

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x3c3c3c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.position.set(-40, 30, 30);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById('webgl-output')
        .appendChild(renderer.domElement);

    const controls = new function () {
        this.scaleX = 1;
        this.scaleY = 1;
        this.scaleZ = 1;

        this.positionX = 0;
        this.positionY = 4;
        this.positionZ = 0;

        this.rotationX = 0;
        this.rotationY = 0;
        this.rotationZ = 0;
        this.scale = 1;

        this.translateX = 0;
        this.translateY = 0;
        this.translateZ = 0;

        this.visible = true;

        this.translate = function () {
            cube.translateX(controls.translateX);
            cube.translateY(controls.translateY);
            cube.translateZ(controls.translateZ);

            controls.positionX = cube.position.x;
            controls.positionY = cube.position.y;
            controls.positionZ = cube.position.z;
        };
    }();


    const material = new THREE.MeshLambertMaterial({ color: 0x44ff44 });
    const geom = new THREE.BoxGeometry(5, 8, 3);

    // var materials = [
    //   new THREE.MeshLambertMaterial({opacity: 0.8, color: 0x44ff44, transparent: true}),
    //   new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
    // ];

    // var cube = THREE.SceneUtils.createMultiMaterialObject(geom, materials);

    const cube = new THREE.Mesh(geom, material);
    cube.position.y = 4;
    cube.castShadow = true;
    scene.add(cube);


    const gui = new dat.GUI();

    const guiScale = gui.addFolder('scale');
    guiScale.add(controls, 'scaleX', 0, 5);
    guiScale.add(controls, 'scaleY', 0, 5);
    guiScale.add(controls, 'scaleZ', 0, 5);

    const guiPosition = gui.addFolder('position');
    const contX = guiPosition.add(controls, 'positionX', -10, 10);
    const contY = guiPosition.add(controls, 'positionY', -4, 20);
    const contZ = guiPosition.add(controls, 'positionZ', -10, 10);

    contX.listen();
    contX.onChange(function (value) {
        cube.position.x = controls.positionX;
        // cube.children[1].position.x = controls.positionX;
    });

    contY.listen();
    contY.onChange(function (value) {
        cube.position.y = controls.positionY;
    });

    contZ.listen();
    contZ.onChange(function (value) {
        cube.position.z = controls.positionZ;
    });


    const guiRotation = gui.addFolder('rotation');
    guiRotation.add(controls, 'rotationX', -4, 4);
    guiRotation.add(controls, 'rotationY', -4, 4);
    guiRotation.add(controls, 'rotationZ', -4, 4);

    const guiTranslate = gui.addFolder('translate');

    guiTranslate.add(controls, 'translateX', -10, 10);
    guiTranslate.add(controls, 'translateY', -10, 10);
    guiTranslate.add(controls, 'translateZ', -10, 10);
    guiTranslate.add(controls, 'translate');

    gui.add(controls, 'visible');

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    render();

    function render() {
        trackballControls.update(clock.getDelta());
        stats.update();
        cube.visible = controls.visible;

        cube.rotation.x = controls.rotationX;
        cube.rotation.y = controls.rotationY;
        cube.rotation.z = controls.rotationZ;

        cube.scale.set(controls.scaleX, controls.scaleY, controls.scaleZ);
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
