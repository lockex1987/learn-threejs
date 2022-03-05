function init() {
    const renderer = initRenderer();
    const camera = initCamera();
    const scene = new THREE.Scene();

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight('#606008', 1);
    scene.add(ambientLight);

    // add spotlight for the shadows
    const spotLight = new THREE.SpotLight(0xffffff, 1, 180, Math.PI / 4);
    spotLight.shadow.mapSize.set(2048, 2048);
    spotLight.position.set(-30, 40, -10);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // add a simple scene
    addHouseAndTree(scene);

    // add controls
    setupControls();

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function setupControls() {
        const controls = new function () {
            this.intensity = ambientLight.intensity;
            this.ambientColor = ambientLight.color.getStyle();
            this.disableSpotlight = false;
        }();

        const gui = new dat.GUI();
        gui.add(controls, 'intensity', 0, 3, 0.1).onChange(function (e) {
            ambientLight.color = new THREE.Color(controls.ambientColor);
            ambientLight.intensity = controls.intensity;
        });
        gui.addColor(controls, 'ambientColor').onChange(function (e) {
            ambientLight.color = new THREE.Color(controls.ambientColor);
            ambientLight.intensity = controls.intensity;
        });
        gui.add(controls, 'disableSpotlight').onChange(function (e) {
            spotLight.visible = !e;
        });
    }

    render();
}


init();
