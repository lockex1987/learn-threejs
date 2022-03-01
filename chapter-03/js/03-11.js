function init() {
    // use the defaults
    const stats = initStats();
    const renderer = initRenderer();
    const camera = initCamera();
    // create a scene, that will hold all our elements such as objects, cameras and lights.
    const scene = new THREE.Scene();


    const cubeGeometry = new THREE.BoxGeometry(20, 20, 20);

    const meshMaterial1 = createMaterial('vertex-shader',
        'fragment-shader-1');
    const meshMaterial2 = createMaterial('vertex-shader',
        'fragment-shader-2');
    const meshMaterial3 = createMaterial('vertex-shader',
        'fragment-shader-3');
    const meshMaterial4 = createMaterial('vertex-shader',
        'fragment-shader-4');
    const meshMaterial5 = createMaterial('vertex-shader',
        'fragment-shader-5');
    const meshMaterial6 = createMaterial('vertex-shader',
        'fragment-shader-6');


    const material = [meshMaterial1, meshMaterial2, meshMaterial3, meshMaterial4, meshMaterial5, meshMaterial6];
    const cube = new THREE.Mesh(cubeGeometry, material);

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

    // call the render function
    let step = 0;
    const oldContext = null;

    const controls = new function () {
        this.rotationSpeed = 0.02;
        this.bouncingSpeed = 0.03;

        this.opacity = meshMaterial1.opacity;
        this.transparent = meshMaterial1.transparent;

        this.visible = meshMaterial1.visible;
        this.side = 'front';

        this.wireframe = meshMaterial1.wireframe;
        this.wireframeLinewidth = meshMaterial1.wireframeLinewidth;

        this.selectedMesh = 'cube';

        this.shadow = 'flat';
    }();


    render();

    function render() {
        stats.update();

        cube.rotation.y = step += 0.01;
        cube.rotation.x = step;
        cube.rotation.z = step;

        cube.material.forEach(function (e) {
            e.uniforms.time.value += 0.01;
        });


        // render using requestAnimationFrame
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function createMaterial(vertexShader, fragmentShader) {
        const vertShader = document.getElementById(vertexShader).innerHTML;
        const fragShader = document.getElementById(fragmentShader).innerHTML;

        const attributes = {};
        const uniforms = {
            time: {
                type: 'f',
                value: 0.2
            },
            scale: {
                type: 'f',
                value: 0.2
            },
            alpha: {
                type: 'f',
                value: 0.6
            },
            resolution: {
                type: 'v2',
                value: new THREE.Vector2()
            }
        };

        uniforms.resolution.value.x = window.innerWidth;
        uniforms.resolution.value.y = window.innerHeight;

        const meshMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader,
            transparent: true

        });


        return meshMaterial;
    }
}


init();
