function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -20;
    camera.position.y = 25;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(5, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl-output')
        .appendChild(renderer.domElement);

    // Ground plane
    const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x494949);
    scene.add(ambientLight);

    


    const vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 3, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ];
    const faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4)
    ];
    const geom = new THREE.Geometry();
    geom.vertices = vertices;
    geom.faces = faces;
    geom.computeFaceNormals();

    const materials = [
        new THREE.MeshBasicMaterial({
            color: 0x000000,
            wireframe: true
        }),
        new THREE.MeshLambertMaterial({
            opacity: 0.6,
            color: 0x44ff44,
            transparent: true
        })
    ];

    const mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials);
    mesh.castShadow = true;
    mesh.children.forEach(function (e) {
        e.castShadow = true;
    });
    scene.add(mesh);

    // Spot light
    const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    spotLight.shadow.mapSize.height = 2048;
    spotLight.shadow.mapSize.width = 2048;
    spotLight.position.set(-40, 30, 30);
    spotLight.castShadow = true;
    spotLight.lookAt(mesh);
    scene.add(spotLight);


    function addControl(x, y, z) {
        const controls = new function () {
            this.x = x;
            this.y = y;
            this.z = z;
        }();
        return controls;
    }

    const controlPoints = [];
    controlPoints.push(addControl(3, 5, 3));
    controlPoints.push(addControl(3, 5, 0));
    controlPoints.push(addControl(3, 0, 3));
    controlPoints.push(addControl(3, 0, 0));
    controlPoints.push(addControl(0, 5, 0));
    controlPoints.push(addControl(0, 5, 3));
    controlPoints.push(addControl(0, 0, 0));
    controlPoints.push(addControl(0, 0, 3));

    const gui = new dat.GUI();
    gui.add(new function () {
        this.clone = function () {
            const clonedGeometry = mesh.children[0].geometry.clone();
            const materials = [
                new THREE.MeshLambertMaterial({
                    opacity: 0.8,
                    color: 0xff44ff,
                    transparent: true
                }),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                })
            ];

            const mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
            mesh2.children.forEach(function (e) {
                e.castShadow = true;
            });
            mesh2.translateX(5);
            mesh2.translateZ(5);
            mesh2.name = 'clone';
            scene.remove(scene.getChildByName('clone'));
            scene.add(mesh2);
        };
    }(), 'clone');

    for (let i = 0; i < 8; i++) {
        const f1 = gui.addFolder('Vertices ' + (i + 1));
        f1.add(controlPoints[i], 'x', -10, 10);
        f1.add(controlPoints[i], 'y', -10, 10);
        f1.add(controlPoints[i], 'z', -10, 10);
    }

    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();


    function render() {
        trackballControls.update(clock.getDelta());

        const vertices = [];
        for (let i = 0; i < 8; i++) {
            vertices.push(new THREE.Vector3(controlPoints[i].x, controlPoints[i].y, controlPoints[i].z));
        }

        mesh.children.forEach(function (e) {
            e.geometry.vertices = vertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
            delete e.geometry.__directGeometry;
        });

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }


    render();
}


init();
