var THREEx = THREEx || {};

THREEx.Planets = {};

THREEx.Planets.baseURL = '../';

// From http://planetpixelemporium.com/

THREEx.Planets.createSun = () => {
    const sunGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const sunTexture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/sunmap.jpg');
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
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/mercurymap.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/mercurybump.jpg'),
        bumpScale: 0.005
    });
    const mercuryMesh = new THREE.Mesh(mercuryGeometry, mercuryMaterial);
    return mercuryMesh;
};


THREEx.Planets.createVenus = () => {
    const venusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const venusMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/venusmap.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/venusbump.jpg'),
        bumpScale: 0.005
    });
    const venusMesh = new THREE.Mesh(venusGeometry, venusMaterial);
    return venusMesh;
};


THREEx.Planets.createEarth = () => {
    const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthbump1k.jpg'),
        bumpScale: 0.02,
        specularMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/earthspec1k.jpg'),
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
        imageTrans.src = THREEx.Planets.baseURL + 'images/earthcloudmaptrans.jpg';
    });
    imageMap.src = THREEx.Planets.baseURL + 'images/earthcloudmap.jpg';

    const earthCloudGeometry = new THREE.SphereGeometry(0.51, 32, 32);
    const earthCloudMesh = new THREE.Mesh(earthCloudGeometry, earthCloudMaterial);
    return earthCloudMesh;
};


THREEx.Planets.createMoon = () => {
    const moonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/moonmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/moonbump1k.jpg'),
        bumpScale: 0.002
    });
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    return moonMesh;
};


THREEx.Planets.createMars = () => {
    const marsGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const marsMaterial = new THREE.MeshPhongMaterial({
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/marsmap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/marsbump1k.jpg'),
        bumpScale: 0.05
    });
    const marsMesh = new THREE.Mesh(marsGeometry, marsMaterial);
    return marsMesh;
};


THREEx.Planets.createJupiter = () => {
    const jupiterGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const jupiterTexture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/jupitermap.jpg');
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
    const saturnTexture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/saturnmap.jpg');
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
        imageTrans.src = THREEx.Planets.baseURL + 'images/saturnringpattern.gif';
    });
    imageMap.src = THREEx.Planets.baseURL + 'images/saturnringcolor.jpg';

    const saturnRingGeometry = new THREEx.Planets._RingGeometry(0.55, 0.75, 64);
    const saturnRingMesh = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
    saturnRingMesh.lookAt(new THREE.Vector3(0.5, -4, 1));
    return saturnRingMesh;
};


THREEx.Planets.createUranus = () => {
    const uranusGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const uranusTexture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/uranusmap.jpg');
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
        imageTrans.src = THREEx.Planets.baseURL + 'images/uranusringtrans.gif';
    }, false);
    imageMap.src = THREEx.Planets.baseURL + 'images/uranusringcolour.jpg';

    const uranusRingGeometry = new THREEx.Planets._RingGeometry(0.55, 0.75, 64);
    const uranusRingMesh = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
    uranusRingMesh.lookAt(new THREE.Vector3(0.5, -4, 1));
    return uranusRingMesh;
};


THREEx.Planets.createNeptune = () => {
    const neptuneGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const neptuneTexture = THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/neptunemap.jpg');
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
        map: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/plutomap1k.jpg'),
        bumpMap: THREE.ImageUtils.loadTexture(THREEx.Planets.baseURL + 'images/plutobump1k.jpg'),
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

THREEx.Planets._RingGeometry.prototype = Object.create(THREE.Geometry.prototype);
