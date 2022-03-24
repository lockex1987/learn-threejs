// http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    PointLight,
    AmbientLight,
    DirectionalLight,
    TextureLoader,
    SphereGeometry,
    MeshPhongMaterial,
    MeshBasicMaterial,
    Mesh,
    BackSide
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';

const THREEx = {};
THREEx.Planets = {};
THREEx.Planets.baseURL = '../';

// From http://planetpixelemporium.com/

const textureLoader = new TextureLoader();

THREEx.Planets.createSun = () => {
    const sunGeometry = new SphereGeometry(0.5, 32, 32);
    const sunTexture = textureLoader.load('../textures/planets/sunmap.jpg');
    const sunMaterial = new THREE.MeshPhongMaterial({
        map: sunTexture,
        bumpMap: sunTexture,
        bumpScale: 0.05
    });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    return sunMesh;
};


THREEx.Planets.createMercury = () => {
    const mercuryGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const mercuryMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/planets/mercurymap.jpg'),
        bumpMap: textureLoader.load('../textures/planets/mercurybump.jpg'),
        bumpScale: 0.005
    });
    const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    return mercuryMesh;
};


THREEx.Planets.createVenus = () => {
    const venusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const venusMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/planets/venusmap.jpg'),
        bumpMap: textureLoader.load('../textures/planets/venusbump.jpg'),
        bumpScale: 0.005
    });
    const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
    return venusMesh;
};


THREEx.Planets.createEarth = () => {
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/planets/earthmap1k.jpg'),
        bumpMap: textureLoader.load('../textures/planets/earthbump1k.jpg'),
        bumpScale: 0.02,
        specularMap: textureLoader.load('../textures/planets/earthspec1k.jpg'),
        specular: new THREE.Color('grey')
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    return earthMesh;
};


THREEx.Planets.createEarthCloud = () => {
    // Create destination canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    const earthCloudMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvas),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });

    // Load earthcloudmap
    const imageMap = new Image();
    imageMap.addEventListener('load', () => {
        // create dataMap ImageData for earthcloudmap
        const canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        const contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        const dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        // load earthcloudmaptrans
        const imageTrans = new Image();
        imageTrans.addEventListener('load', () => {
            // create dataTrans ImageData for earthcloudmaptrans
            const canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            const contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            const dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            // merge dataMap + dataTrans into dataResult
            const dataResult = contextMap.createImageData(canvasMap.width, canvasMap.height);
            for (let y = 0, offset = 0; y < imageMap.height; y++) {
                for (let x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0];
                }
            }
            // update texture with result
            context.putImageData(dataResult, 0, 0);
            earthCloudMaterial.map.needsUpdate = true;
        });
        imageTrans.src = '../textures/planets/earthcloudmaptrans.jpg';
    });
    imageMap.src = '../textures/planets/earthcloudmap.jpg';

    const earthCloudGeometry = new THREE.SphereGeometry(0.51, 32, 32);
    const earthCloudMesh = new THREE.Mesh(earthCloudGeometry, earthCloudMaterial);
    return earthCloudMesh;
};


THREEx.Planets.createMoon = () => {
    const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/planets/moonmap1k.jpg'),
        bumpMap: textureLoader.load('../textures/planets/moonbump1k.jpg'),
        bumpScale: 0.002
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    return moonMesh;
};


THREEx.Planets.createMars = () => {
    const marsGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const marsMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/planets/marsmap1k.jpg'),
        bumpMap: textureLoader.load('../textures/planets/marsbump1k.jpg'),
        bumpScale: 0.05
    });
    const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
    return marsMesh;
};


THREEx.Planets.createJupiter = () => {
    const jupiterGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const jupiterTexture = textureLoader.load('../textures/planets/jupitermap.jpg');
    const jupiterMaterial = new THREE.MeshPhongMaterial({
        map: jupiterTexture,
        bumpMap: jupiterTexture,
        bumpScale: 0.02
    });
    const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
    return jupiterMesh;
};


THREEx.Planets.createSaturn = () => {
    const saturnGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const saturnTexture = textureLoader.load('../textures/planets/saturnmap.jpg');
    const saturnMaterial = new THREE.MeshPhongMaterial({
        map: saturnTexture,
        bumpMap: saturnTexture,
        bumpScale: 0.05
    });
    const saturnMesh = new THREE.Mesh(saturnGeometry, saturnMaterial);
    return saturnMesh;
};


THREEx.Planets.createSaturnRing = () => {
    // create destination canvas
    const canvas = document.createElement('canvas');
    canvas.width = 915;
    canvas.height = 64;
    const context = canvas.getContext('2d');

    const saturnRingMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvas),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });

    // load earthcloudmap
    const imageMap = new Image();
    imageMap.addEventListener('load', () => {
        // create dataMap ImageData for earthcloudmap
        const canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        const contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        const dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        // load earthcloudmaptrans
        const imageTrans = new Image();
        imageTrans.addEventListener('load', () => {
            // create dataTrans ImageData for earthcloudmaptrans
            const canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            const contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            const dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            // merge dataMap + dataTrans into dataResult
            const dataResult = contextMap.createImageData(canvas.width, canvas.height);
            for (let y = 0, offset = 0; y < imageMap.height; y++) {
                for (let x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 4;
                }
            }
            // update texture with result
            context.putImageData(dataResult, 0, 0);
            saturnRingMaterial.map.needsUpdate = true;
        });
        imageTrans.src = '../textures/planets/saturnringpattern.gif';
    });
    imageMap.src = '../textures/planets/saturnringcolor.jpg';

    const saturnRingGeometry = new THREEx.Planets._RingGeometry(0.55, 0.75, 64);
    const saturnRingMesh = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRingMesh.lookAt(new THREE.Vector3(0.5, -4, 1));
    return saturnRingMesh;
};


THREEx.Planets.createUranus = () => {
    const uranusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const uranusTexture = textureLoader.load('../textures/planets/uranusmap.jpg');
    const uranusMaterial = new THREE.MeshPhongMaterial({
        map: uranusTexture,
        bumpMap: uranusTexture,
        bumpScale: 0.05
    });
    const uranusMesh = new THREE.Mesh(uranusGeometry, uranusMaterial);
    return uranusMesh;
};


THREEx.Planets.createUranusRing = () => {
    // create destination canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 72;
    const context = canvas.getContext('2d');

    const uranusRingMaterial = new THREE.MeshPhongMaterial({
        map: new THREE.Texture(canvas),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });

    // load earthcloudmap
    const imageMap = new Image();
    imageMap.addEventListener('load', () => {
        // create dataMap ImageData for earthcloudmap
        const canvasMap = document.createElement('canvas');
        canvasMap.width = imageMap.width;
        canvasMap.height = imageMap.height;
        const contextMap = canvasMap.getContext('2d');
        contextMap.drawImage(imageMap, 0, 0);
        const dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height);

        // load earthcloudmaptrans
        const imageTrans = new Image();
        imageTrans.addEventListener('load', function () {
            // create dataTrans ImageData for earthcloudmaptrans
            const canvasTrans = document.createElement('canvas');
            canvasTrans.width = imageTrans.width;
            canvasTrans.height = imageTrans.height;
            const contextTrans = canvasTrans.getContext('2d');
            contextTrans.drawImage(imageTrans, 0, 0);
            const dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height);
            // merge dataMap + dataTrans into dataResult
            const dataResult = contextMap.createImageData(canvas.width, canvas.height);
            for (let y = 0, offset = 0; y < imageMap.height; y++) {
                for (let x = 0; x < imageMap.width; x++, offset += 4) {
                    dataResult.data[offset + 0] = dataMap.data[offset + 0];
                    dataResult.data[offset + 1] = dataMap.data[offset + 1];
                    dataResult.data[offset + 2] = dataMap.data[offset + 2];
                    dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 2;
                }
            }
            // update texture with result
            context.putImageData(dataResult, 0, 0);
            uranusRingMaterial.map.needsUpdate = true;
        });
        imageTrans.src = '../textures/planets/uranusringtrans.gif';
    }, false);
    imageMap.src = '../textures/planets/uranusringcolour.jpg';

    const uranusRingGeometry = new THREEx.Planets._RingGeometry(0.55, 0.75, 64);
    const uranusRingMesh = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
    uranusRingMesh.lookAt(new THREE.Vector3(0.5, -4, 1));
    return uranusRingMesh;
};


THREEx.Planets.createNeptune = () => {
    const neptuneGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const neptuneTexture = textureLoader.load('../textures/planets/neptunemap.jpg');
    const neptuneMaterial = new THREE.MeshPhongMaterial({
        map: neptuneTexture,
        bumpMap: neptuneTexture,
        bumpScale: 0.05
    });
    const neptuneMesh = new THREE.Mesh(neptuneGeometry, neptuneMaterial);
    return neptuneMesh;
};


THREEx.Planets.createPluto = () => {
    const plutoGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const plutoMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../textures/planets/plutomap1k.jpg'),
        bumpMap: textureLoader.load('../textures/planets/plutobump1k.jpg'),
        bumpScale: 0.005
    });
    const plutoMesh = new THREE.Mesh(plutoGeometry, plutoMaterial);
    return plutoMesh;
};


/**
 * change the original from three.js because i needed different UV
 *
 * @author Kaleb Murphy
 * @author jerome etienne
 */
THREEx.Planets._RingGeometry = function (innerRadius, outerRadius, thetaSegments) {
    THREE.Geometry.call(this);

    innerRadius = innerRadius || 0;
    outerRadius = outerRadius || 50;
    thetaSegments = thetaSegments || 8;

    const normal = new THREE.Vector3(0, 0, 1);

    for (let i = 0; i < thetaSegments; i++) {
        const angleLo = (i / thetaSegments) * Math.PI * 2;
        const angleHi = ((i + 1) / thetaSegments) * Math.PI * 2;

        const vertex1 = new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0);
        const vertex2 = new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0);
        const vertex3 = new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0);
        const vertex4 = new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0);

        this.vertices.push(vertex1);
        this.vertices.push(vertex2);
        this.vertices.push(vertex3);
        this.vertices.push(vertex4);


        const vertexIdx = i * 4;
        const face = new THREE.Face4(vertexIdx + 0, vertexIdx + 1, vertexIdx + 3, vertexIdx + 2, [normal, normal, normal, normal]);
        this.faces.push(face);

        const uvs = [];
        uvs.push(new THREE.Vector2(1, 0));
        uvs.push(new THREE.Vector2(0, 0));
        uvs.push(new THREE.Vector2(0, 0));
        uvs.push(new THREE.Vector2(1, 0));
        this.faceVertexUvs[0].push(uvs);
    }

    this.computeCentroids();
    this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outerRadius);
};

// TODO: bị lỗi
// THREEx.Planets._RingGeometry.prototype = Object.create(THREE.Geometry.prototype);





/**
 * from http://stemkoski.blogspot.fr/2013/07/shaders-in-threejs-glow-and-halo.html
 * @return {[type]} [description]
 */
THREEx.createAtmosphereMaterial = function () {
    const vertexShader = [
        'varying vec3 vNormal;',
        'void main(){',
        ' // compute intensity',
        ' vNormal  = normalize( normalMatrix * normal );',
        ' // set gl_Position',
        ' gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
        '}'
    ].join('\n');
    const fragmentShader = [
        'uniform float coeficient;',
        'uniform float power;',
        'uniform vec3  glowColor;',

        'varying vec3  vNormal;',

        'void main(){',
        ' float intensity = pow( coeficient - dot(vNormal, vec3(0.0, 0.0, 1.0)), power );',
        ' gl_FragColor = vec4( glowColor * intensity, 1.0 );',
        '}'
    ].join('\n');

    // create custom material from the shader code above
    //   that is within specially labeled script tags
    const material = new THREE.ShaderMaterial({
        uniforms: {
            coeficient: {
                type: 'f',
                value: 1.0
            },
            power: {
                type: 'f',
                value: 2
            },
            glowColor: {
                type: 'c',
                value: new THREE.Color('pink')
            }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    return material;
};




THREEx.addAtmosphereMaterial2DatGui = function (material, datGui) {
    datGui = datGui || new dat.GUI();
    const uniforms = material.uniforms;
    // options
    const options = {
        coeficient: uniforms.coeficient.value,
        power: uniforms.power.value,
        glowColor: '#' + uniforms.glowColor.value.getHexString(),
        presetFront: function () {
            options.coeficient = 1;
            options.power = 2;
            onChange();
        },
        presetBack: function () {
            options.coeficient = 0.5;
            options.power = 4.0;
            onChange();
        }
    };

    const onChange = function () {
        uniforms.coeficient.value = options.coeficient;
        uniforms.power.value = options.power;
        uniforms.glowColor.value.set(options.glowColor);
    };
    onChange();

    // config datGui
    datGui.add(options, 'coeficient', 0.0, 2)
        .listen().onChange(onChange);
    datGui.add(options, 'power', 0.0, 30)
        .listen().onChange(onChange);
    datGui.addColor(options, 'glowColor')
        .listen().onChange(onChange);
    datGui.add(options, 'presetFront');
    datGui.add(options, 'presetBack');
};




function init() {
    const canvas = document.querySelector('#webglOutput');
    const renderer = new THREE.WebGLRenderer({
        canvas
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

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
    starFieldMaterial.map = textureLoader.load('../textures/planets/galaxy_starfield.png');
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

    function render(nowMsec) {
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
        const deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
        lastTimeMsec = nowMsec;
        const delta = deltaMsec / 1000;

        update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


init();
