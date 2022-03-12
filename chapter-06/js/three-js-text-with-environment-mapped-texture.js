/* --------------------------
* THREE JS EXPERIMENT
* Omar Scene
* https://codepen.io/chrisjdesigner/pen/MWbKxyb
* -------------------------- */


let scene,
    camera,
    renderer,
    controls;


// Add Greensock Ticker
gsap.ticker.add(render);


function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    scene.fog = new THREE.Fog(0xFFFFFF, 0, 16);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(1, 0.5, 5);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.z = 2500;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    camera.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 0.5);
    pointLight3.position.x = -1000;
    pointLight3.position.z = 1000;
    scene.add(pointLight3);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2, 100);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.001;
    scene.add(directionalLight);

    // Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 40;
    directionalLight.shadow.bias = -0.0010;
    directionalLight.shadow.radius = 48;

    const planeGeometry = new THREE.PlaneBufferGeometry(128, 128, 128, 128);
    const planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.3;

    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.position.z = 0;
    plane.position.y = 0;
    scene.add(plane);

    const loader = new THREE.FontLoader();
    loader.load('https://assets.codepen.io/122136/helvetiker_bold.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry('ThreeJS Text', {
            font: font,
            size: 0.3,
            height: 0.01,
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.05,
            bevelSize: 0.01,
            bevelOffset: 0,
            bevelSegments: 10
        });

        // ENVIRONMENT MAP
        const path = 'https://assets.codepen.io/122136/';
        const format = '.jpg';
        const urls = [
            path + 'px' + format,
            path + 'nx' + format,
            path + 'py' + format,
            path + 'ny' + format,
            path + 'pz' + format,
            path + 'nz' + format
        ];

        const reflectionCube = new THREE.CubeTextureLoader().load(urls);
        reflectionCube.encoding = THREE.sRGBEncoding;

        const textMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 1,
            envMap: reflectionCube,
            roughness: 0,
            ambientIntensity: 0.9,
            aoMapIntensity: 0.4,
            envMapIntensity: 1
        });

        const textMesh1 = new THREE.Mesh(textGeometry, textMat);
        textMesh1.castShadow = true;
        textMesh1.receiveShadow = true;
        textMesh1.position.x = 0;
        textMesh1.position.y = 0;
        textMesh1.position.z = 0;
        textMesh1.rotation.x = 0;
        textMesh1.rotation.y = Math.PI * 2;
        scene.add(textMesh1);

        // SET CAMERA TO THE OBJECT
        const bb = new THREE.Box3();
        bb.setFromObject(textMesh1);
        bb.getCenter(controls.target);

        controls.update();

        const cameraTimeline = gsap.timeline({});

        // Animate the ball positioning
        cameraTimeline
            .from(camera.position, {
                duration: 5,
                y: Math.PI,
                x: -Math.PI,
                z: 0.5,
                ease: 'power2.inOut',
                onUpdate: function () {
                    controls.update();
                }
            })
        ;

        render();
    });

    // RENDERER
    renderer = new THREE.WebGLRenderer({ antialias: true });

    // Shadow maps
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.keyPanSpeed = 100;
    controls.update();

    renderer.setSize(window.innerWidth, window.innerHeight);

    // Set the renderer to render at native device ratios
    renderer.setPixelRatio(window.devicePixelRatio);

    // Add the threejs scene to the app div
    document.getElementById('app').appendChild(renderer.domElement);

    render();
}


function render() {
    renderer.render(scene, camera);
}


init();
