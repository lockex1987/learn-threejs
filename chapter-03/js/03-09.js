function init() {
    const scene = new THREE.Scene();
    const camera = initCamera();
    const renderer = initRenderer();

    addLargeGroundPlane(scene);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-0, 30, 60);
    spotLight.castShadow = true;
    spotLight.intensity = 0.6;
    scene.add(spotLight);

    // call the render function
    let step = 0;
    const material = new THREE.MeshStandardMaterial({ color: 0x7777ff });
    const controls = new function () {
        this.color = material.color.getStyle();
        this.emissive = material.emissive.getStyle();
    }();

    const gui = new dat.GUI();
    addBasicMaterialSettings(gui, controls, material);
    addMeshSelection(gui, controls, material, scene);
    const spGui = gui.addFolder('THREE.MeshStandardMaterial');
    spGui.addColor(controls, 'color').onChange(function (e) {
        material.color.setStyle(e);
    });
    spGui.addColor(controls, 'emissive').onChange(function (e) {
        material.emissive = new THREE.Color(e);
    });
    spGui.add(material, 'metalness', 0, 1, 0.01);
    spGui.add(material, 'roughness', 0, 1, 0.01);
    spGui.add(material, 'wireframe');
    spGui.add(material, 'wireframeLinewidth', 0, 20);

    camera.lookAt(controls.selected.position);


    function render() {
        if (controls.selected) controls.selected.rotation.y = step += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    render();
}


init();
