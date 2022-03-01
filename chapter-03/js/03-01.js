function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x0c0c0c);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);
}


function init() {
    const scene = new THREE.Scene();

    const camera = initCamera();
    camera.position.x = -20;
    camera.position.y = 50;
    camera.position.z = 40;
    camera.lookAt(new THREE.Vector3(10, 0, 0));

    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15);
    const meshMaterial = new THREE.MeshBasicMaterial({
        color: 0x7777ff,
        name: 'Basic Material',
        flatShading: true
    });

    const cube = new THREE.Mesh(cubeGeometry, meshMaterial);
    cube.position.x = 0;
    cube.position.y = 3;
    cube.position.z = 2;
    scene.add(cube);

    // Không bị ảnh hưởng bởi ánh sáng
    // addLights(scene);

    document.getElementById('webgl-output').appendChild(renderer.domElement);

    // call the render function
    let step = 0;

    const controls = new function () {
        this.color = meshMaterial.color.getStyle();
    }();

    const gui = new dat.GUI();
    // addBasicMaterialSettings(gui, controls, meshMaterial);
    const spGui = gui.addFolder('THREE.MeshBasicMaterial');
    spGui.addColor(controls, 'color').onChange(function (e) {
        meshMaterial.color.setStyle(e);
    });
    spGui.add(meshMaterial, 'wireframe');
    spGui.add(meshMaterial, 'wireframeLinewidth', 0, 20);
    spGui.add(meshMaterial, 'wireframeLinejoin', ['round', 'bevel', 'miter']).onChange(function (e) {
        meshMaterial.wireframeLinejoin = e;
    });
    spGui.add(meshMaterial, 'wireframeLinecap', ['butt', 'round', 'square']).onChange(function (e) {
        meshMaterial.wireframeLinecap = e;
    });

    function render() {
        cube.rotation.y = step += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}


init();
