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

    // add the plane to the scene
    scene.add(plane);

    // position and point the camera to the center of the scene
    camera.position.x = -50;
    camera.position.y = 30;
    camera.position.z = 20;
    camera.lookAt(new THREE.Vector3(-10, 0, 0));

    // add subtle ambient lighting
    const ambientLight = new THREE.AmbientLight(0x555555);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff, 1.2, 150, Math.PI / 4, 0, 2);
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.position.set(-40, 30, 30);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add geometries
    addGeometries(scene);

    // add the output of the renderer to the html element
    document.getElementById('webgl-output').appendChild(renderer.domElement);

    // call the render function
    const step = 0;


    function addGeometries(scene) {
        const geoms = [];

        geoms.push(new THREE.CylinderGeometry(1, 4, 4));

        // basic cube
        geoms.push(new THREE.BoxGeometry(2, 2, 2));

        // basic spherer
        geoms.push(new THREE.SphereGeometry(2));

        geoms.push(new THREE.IcosahedronGeometry(4));

        // create a convex shape (a shape without dents)
        // using a couple of points
        // for instance a cube
        const points = [
            new THREE.Vector3(2, 2, 2),
            new THREE.Vector3(2, 2, -2),
            new THREE.Vector3(-2, 2, -2),
            new THREE.Vector3(-2, 2, 2),
            new THREE.Vector3(2, -2, 2),
            new THREE.Vector3(2, -2, -2),
            new THREE.Vector3(-2, -2, -2),
            new THREE.Vector3(-2, -2, 2)
        ];
        geoms.push(new THREE.ConvexGeometry(points));

        // create a lathgeometry
        // http://en.wikipedia.org/wiki/Lathe_(graphics)
        const pts = []; // points array - the path profile points will be stored here
        const detail = 0.1; // half-circle detail - how many angle increments will be used to generate points
        const radius = 3; // radius for half_sphere

        // loop from 0.0 radians to PI (0 - 180 degrees)
        for (let angle = 0.0; angle < Math.PI; angle += detail) {
            // angle/radius to x,z
            pts.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
        }
        geoms.push(new THREE.LatheGeometry(pts, 12));

        // create a OctahedronGeometry
        geoms.push(new THREE.OctahedronGeometry(3));

        // create a geometry based on a function
        geoms.push(new THREE.ParametricGeometry(THREE.ParametricGeometries.mobius3d, 20, 10));

        //
        geoms.push(new THREE.TetrahedronGeometry(3));

        geoms.push(new THREE.TorusGeometry(3, 1, 10, 10));

        geoms.push(new THREE.TorusKnotGeometry(3, 0.5, 50, 20));

        let j = 0;
        for (let i = 0; i < geoms.length; i++) {
            const cubeMaterial = new THREE.MeshLambertMaterial({
                wireframe: true,
                color: Math.random() * 0xffffff
            });

            const materials = [

                new THREE.MeshLambertMaterial({
                    color: Math.random() * 0xffffff
                }),
                new THREE.MeshBasicMaterial({
                    color: 0x000000,
                    wireframe: true
                })

            ];

            const mesh = THREE.SceneUtils.createMultiMaterialObject(geoms[i], materials);
            mesh.traverse(function (e) {
                e.castShadow = true;
            });

            // var mesh = new THREE.Mesh(geoms[i],materials[i]);
            // mesh.castShadow=true;
            mesh.position.x = -24 + ((i % 4) * 12);
            mesh.position.y = 4;
            mesh.position.z = -8 + (j * 12);

            if ((i + 1) % 4 == 0) j++;
            scene.add(mesh);
        }
    }


    const trackballControls = initTrackballControls(camera, renderer);
    const clock = new THREE.Clock();

    render();

    function render() {
        trackballControls.update(clock.getDelta());
        stats.update();

        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
}
