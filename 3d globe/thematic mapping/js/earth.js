// Created by Bjorn Sandvik - thematicmapping.org

function createSphere(radius, segments) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('images/2_no_clouds_4k.jpg'),
            bumpMap: THREE.ImageUtils.loadTexture('images/elev_bump_4k.jpg'),
            bumpScale: 0.005,
            specularMap: THREE.ImageUtils.loadTexture('images/water_4k.png'),
            specular: new THREE.Color('grey')
        })
    );
}


function createClouds(radius, segments) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius + 0.003, segments, segments),
        new THREE.MeshPhongMaterial({
            map: THREE.ImageUtils.loadTexture('images/fair_clouds_4k.png'),
            transparent: true
        })
    );
}


function createStars(radius, segments) {
    return new THREE.Mesh(
        new THREE.SphereGeometry(radius, segments, segments),
        new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('images/galaxy_starfield.png'),
            side: THREE.BackSide
        })
    );
}


function setupLights(scene) {
    scene.add(new THREE.AmbientLight(0x333333));

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);
}


function init() {
    const webglElement = document.getElementById('webgl');

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage(webglElement);
        return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Earth params
    const radius = 0.5;
    const segments = 32;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 1000);
    camera.position.z = 1.5;

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    setupLights(scene);

    const sphere = createSphere(radius, segments);
    scene.add(sphere);

    const clouds = createClouds(radius, segments);
    scene.add(clouds);

    const stars = createStars(90, 64);
    scene.add(stars);

    const trackballControls = new THREE.TrackballControls(camera);

    webglElement.appendChild(renderer.domElement);

    function update() {
        sphere.rotation.y += 0.0005;
        clouds.rotation.y += 0.0005;
    }

    function animate() {
        trackballControls.update();
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
}


init();
