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
    BoxGeometry,
    MeshPhongMaterial,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshFaceMaterial,
    Mesh,
    BackSide,
    Vector3
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


// http://www.smartjava.org/content/html5-render-open-data-3d-world-globe-threejs/









/**
 * Convert the positions from a lat, lon to a position on a sphere.
 */
function latLongToVector3(lat, lon, radius, heigth) {
    const phi = (lat) * Math.PI / 180;
    const theta = (lon - 180) * Math.PI / 180;
    const x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
    const y = (radius + heigth) * Math.sin(phi);
    const z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);
    return new Vector3(x, y, z);
}


/**
 * From http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
 */
function csvToArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ',');

    const objPattern = new RegExp(
        (
            // Delimiters
            '(\\' + strDelimiter + '|\\r?\\n|\\r|^)'

            // Quoted fields
            + '(?:"([^"]*(?:""[^"]*)*)"|'

            // Standard fields
            + '([^"\\' + strDelimiter + '\\r\\n]*))'
        ),
        'gi'
    );

    const arrData = [[]];
    let arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        let strMatchedValue;
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp('""', 'g'),
                '"'
            );
        } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];
        }

        // Now that we have our value string, let's add
        // it to the data array
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}


async function init() {
    const text = await fetch('data/density.csv').then(resp => resp.text());
    const data = csvToArray(text);
    new ThreejsExample(document.querySelector('#webglOutput'), data);
}


class ThreejsExample {
    constructor(canvas, data) {
        this.scene = new Scene();

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const aspect = width / height;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 100);
        this.camera.position.z = 18;

        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const aspectRatio = window.devicePixelRatio;
        this.renderer.setSize(width * aspectRatio, height * aspectRatio, false);
        this.renderer.setClearColor(0x111111);

        this.setupLights();

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;

        this.addEarth();
        this.addClouds();
        this.addDensity(data);

        requestAnimationFrame(this.render.bind(this));
    }

    setupLights() {
        const ambientLight = new AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);

        const directionalLight = new DirectionalLight(0xffffff, 4);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        this.light = new PointLight(0x3333ee, 3.5);
        this.light.position.z = 18;
        // this.scene.add(this.light);
    }

    render() {
        this.orbitControls.update();
        /*
        const timer = Date.now() * 0.0001;
        camera.position.x = (Math.cos(timer) * 18);
        camera.position.z = (Math.sin(timer) * 18);
        camera.lookAt(scene.position);
        // light.position.set(camera.position);
        // light.lookAt(scene.position);
        */
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    addEarth() {
        const earthGeometry = new SphereGeometry(6, 50, 50);
        const textureLoader = new TextureLoader();
        const earthTexture = textureLoader.load('../textures/globe2/world-big-2-grey.jpg');
        const earthMaterial = new MeshPhongMaterial({
            map: earthTexture,
            // perPixel: false,
            shininess: 0.2
        });
        const earthMesh = new Mesh(earthGeometry, earthMaterial);
        this.scene.add(earthMesh);
    }

    addClouds() {
        const cloudsGeometry = new SphereGeometry(6, 50, 50);
        const textureLoader = new TextureLoader();
        const cloudsTexture = textureLoader.load('../textures/globe2/earth_clouds_1024.png');
        const cloudsMaterial = new MeshPhongMaterial({
            color: 0xffffff,
            map: cloudsTexture,
            transparent: true,
            opacity: 0.3
        });
        const cloudsMesh = new Mesh(cloudsGeometry, cloudsMaterial);
        cloudsMesh.scale.set(1.015, 1.015, 1.015);
        this.scene.add(cloudsMesh);
    }

    // Simple function that converts the density data to the markers on screen
    // The height of each marker is relative to the density
    addDensity(data) {
    // The geometry that will contain all our cubes
    // const geom = new THREE.Geometry();

        // Material to use for each of our elements
        // Could use a set of materials to
        // add colors relative to the density
        // Not done here.
        const cubeMaterial = new MeshLambertMaterial({
            color: 0x000000,
            opacity: 0.6,
            emissive: 0xffffff
        });
        for (let i = 0; i < data.length - 1; i++) {
            // Get the data, and set the offset,
            // we need to do this since the x,y coordinates
            // from the data aren't in the correct format
            const x = parseInt(data[i][0]) + 180;
            const y = parseInt((data[i][1]) - 84) * -1;
            const value = parseFloat(data[i][2]);

            // Calculate the position where we need to start the cube
            const position = latLongToVector3(y, x, 6, 2);

            // Create the cube
            const cube = new Mesh(new BoxGeometry(7, 7, 7 + value / 8), cubeMaterial); // 1 + value / 8

            // Position the cube correctly
            // cube.position.set(position);
            cube.lookAt(new Vector3(0, 0, 0));

            // Merge with main model
            // THREE.GeometryUtils.merge(geom, cube);
            if (i < 100) {
                this.scene.add(cube);
            }
        }

        // Create a new mesh, containing all the other meshes
        // And add the total mesh to the scene
        // const total = new Mesh(geom, new MeshFaceMaterial());
        // scene.add(total);
    }
}


init();
