function init() {
    // use the defaults
    const stats = initStats();
    // var camera = initCamera();

    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();

    // create a camera, which defines where we're looking at.
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-20, 30, 40);
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    // create a render and set the size

    const webGLRenderer = new THREE.WebGLRenderer();
    webGLRenderer.setClearColor(new THREE.Color(0x000000));
    webGLRenderer.setSize(window.innerWidth, window.innerHeight);

    const canvasRenderer = new THREE.CanvasRenderer();
    canvasRenderer.setSize(window.innerWidth, window.innerHeight);
    const renderer = webGLRenderer;

    const groundGeom = new THREE.PlaneGeometry(100, 100, 4, 4);
    const groundMesh = new THREE.Mesh(groundGeom, new THREE.MeshBasicMaterial({
        color: 0x777777
    }));
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -20;
    scene.add(groundMesh);

    const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    const planeGeometry = new THREE.PlaneGeometry(14, 14, 4, 4);


    const meshMaterial = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
    const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    const plane = new THREE.Mesh(planeGeometry, meshMaterial);

    let selectedMesh = cube;

    // position the sphere
    sphere.position.x = 0;
    sphere.position.y = 3;
    sphere.position.z = 2;

    for (let f = 0, fl = sphere.geometry.faces.length; f < fl; f++) {
        const face = sphere.geometry.faces[f];
        const centroid = new THREE.Vector3(0, 0, 0);
        centroid.add(sphere.geometry.vertices[face.a]);
        centroid.add(sphere.geometry.vertices[face.b]);
        centroid.add(sphere.geometry.vertices[face.c]);
        centroid.divideScalar(3);

        const arrow = new THREE.ArrowHelper(
            face.normal,
            centroid,
            2,
            0x3333FF,
            0.5,
            0.5);
    // sphere.add(arrow);
    }


    cube.position = sphere.position;
    plane.position = sphere.position;


    // add the sphere to the scene
    scene.add(cube);



    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add the output of the renderer to the html element
    document.getElementById('webgl-output').appendChild(renderer.domElement);

    // call the render function
    let step = 0;
    const oldContext = null;

    const controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;
        this.selectedMesh = 'cube';
    }();

    const gui = new dat.GUI();
    addBasicMaterialSettings(gui, controls, meshMaterial);

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
