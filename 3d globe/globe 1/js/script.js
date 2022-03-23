// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/
function init() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.z = 1.5;

    const light1 = new THREE.AmbientLight(0x888888);
    scene.add(light1);

    const light2 = new THREE.DirectionalLight(0xcccccc, 1);
    light2.position.set(5, 3, 5);
    scene.add(light2);

    // Add an object and make it move
    // const earthMesh = THREEx.Planets.createEarth();
    // scene.add(earthMesh);

    // const earthCloudMesh = THREEx.Planets.createEarthCloud();
    // scene.add(earthCloudMesh);

    // const sunMesh = THREEx.Planets.createSun();
    // scene.add(sunMesh);

    // const mercuryMesh = THREEx.Planets.createMercury();
    // scene.add(mercuryMesh);

    // const venusMesh = THREEx.Planets.createVenus();
    // scene.add(venusMesh);

    // const moonMesh = THREEx.Planets.createMoon();
    // scene.add(moonMesh);

    // const marsMesh = THREEx.Planets.createMars();
    // scene.add(marsMesh);

    // const jupiterMesh = THREEx.Planets.createJupiter();
    // scene.add(jupiterMesh);

    // const saturnMesh = THREEx.Planets.createSaturn();
    // scene.add(saturnMesh);

    // const saturnRingMesh = THREEx.Planets.createSaturnRing();
    // scene.add(saturnRingMesh);

    // const uranusMesh = THREEx.Planets.createUranus();
    // scene.add(uranusMesh);

    // const uranusRingMesh = THREEx.Planets.createUranusRing();
    // scene.add(uranusRingMesh);

    // const neptuneMesh = THREEx.Planets.createNeptune();
    // scene.add(neptuneMesh);

    const plutoMesh = THREEx.Planets.createPluto();
    scene.add(plutoMesh);

    // Add star field
    const starFieldGeometry = new THREE.SphereGeometry(90, 32, 32);
    const starFieldMaterial = new THREE.MeshBasicMaterial();
    starFieldMaterial.map = THREE.ImageUtils.loadTexture('bower_components/threex.planets/images/galaxy_starfield.png');
    starFieldMaterial.side = THREE.BackSide;
    const starFieldMesh = new THREE.Mesh(starFieldGeometry, starFieldMaterial);
    scene.add(starFieldMesh);

    // Camera Controls
    const mouse = {
        x: 0,
        y: 0
    };
    document.addEventListener('mousemove', evt => {
        mouse.x = (evt.clientX / window.innerWidth) - 0.5;
        mouse.y = (evt.clientY / window.innerHeight) - 0.5;
    });

    let lastTimeMsec = null;

    function update(delta) {
        // earthMesh.rotateY(1 / 32 * delta);
        // earthCloudMesh.rotateY(1 / 16 * delta);
        camera.position.x += (mouse.x * 5 - camera.position.x) * (delta * 3);
        camera.position.y += (mouse.y * 5 - camera.position.y) * (delta * 3);
        camera.lookAt(scene.position);
    }

    function animate(nowMsec) {
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        const delta = deltaMsec / 1000;

        update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
}

require(['bower_components/threex.planets/package.require.js'], init);
