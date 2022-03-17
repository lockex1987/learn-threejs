function init() {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -40;
    camera.position.y = 40;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0xEEEEEE));
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.shadowMapEnabled = true;

    const groundGeometry = new THREE.PlaneGeometry(95, 95, 1, 1);
    // console.log(groundGeom.faceVertexUvs[1]);
    // http://stackoverflow.com/questions/15137695/three-js-lightmap-causes-an-error-webglrenderingcontext-gl-error-gl-invalid-op
    // https://github.com/mrdoob/three.js/pull/2372
    // lightmaps use own mapping of uvs (faceVertexUvs[1])
    // so need to create those. Reason is explained
    // here. So we can use a low res map for lightmap
    // and a high res map for textures.
    groundGeometry.faceVertexUvs[1] = groundGeometry.faceVertexUvs[0];
    // console.log(groundGeom.faceVertexUvs[1]);

    const lightMapTexture = THREE.ImageUtils.loadTexture('../textures/light_map.png');
    const groundMaterial = new THREE.MeshBasicMaterial({
        color: 0x777777,
        lightMap: lightMapTexture
    });

    //  groundMaterial.lightMap = lm;
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -5;
    scene.add(groundMesh);

    const cubeGeometry1 = new THREE.BoxGeometry(11, 11, 11);
    const cubeGeometry2 = new THREE.BoxGeometry(5, 5, 5);
    const meshMaterial = new THREE.MeshNormalMaterial();

    const cube1 = new THREE.Mesh(cubeGeometry1, meshMaterial);
    const cube2 = new THREE.Mesh(cubeGeometry2, meshMaterial);
    cube1.position.set(0, 0, 0);
    cube2.position.set(-16.5, 2, 4);
    scene.add(cube1);
    scene.add(cube2);

    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    document.getElementById('WebGL-output').appendChild(renderer.domElement);

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}


window.onload = init;
