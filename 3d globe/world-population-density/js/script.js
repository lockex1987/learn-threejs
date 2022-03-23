// http://www.smartjava.org/content/html5-render-open-data-3d-world-globe-threejs/
// Couple of constants
const POS_X = 1800;
const POS_Y = 500;
const POS_Z = 1800;
const WIDTH = 1000;
const HEIGHT = 600;

const FOV = 45;
const NEAR = 1;
const FAR = 4000;

// Some global variables and initialization code
// Simple basic renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
renderer.setClearColorHex(0x111111);

// Add it to the target element
const mapDiv = document.getElementById('globe');
mapDiv.appendChild(renderer.domElement);

// Setup a camera that points to the center
const camera = new THREE.PerspectiveCamera(FOV, WIDTH / HEIGHT, NEAR, FAR);
camera.position.set(POS_X, POS_Y, POS_Z);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// Create a basic scene and add the camera
const scene = new THREE.Scene();
scene.add(camera);


// Simple function that converts the density data to the markers on screen
// The height of each marker is relative to the density
function addDensity(data) {
    // The geometry that will contain all our cubes
    const geom = new THREE.Geometry();

    // Material to use for each of our elements
    // Could use a set of materials to
    // add colors relative to the density
    // Not done here.
    const cubeMat = new THREE.MeshLambertMaterial({
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
        const position = latLongToVector3(y, x, 600, 2);

        // Create the cube
        const cube = new THREE.Mesh(new THREE.CubeGeometry(5, 5, 1 + value / 8, 1, 1, 1, cubeMat));

        // Position the cube correctly
        cube.position = position;
        cube.lookAt(new THREE.Vector3(0, 0, 0));

        // Merge with main model
        THREE.GeometryUtils.merge(geom, cube);
        // scene.add(cube);
    }

    // Create a new mesh, containing all the other meshes
    const total = new THREE.Mesh(geom, new THREE.MeshFaceMaterial());

    // And add the total mesh to the scene
    scene.add(total);
}

let light;

/**
 * Add a simple light.
 */
function addLights() {
    light = new THREE.DirectionalLight(0x3333ee, 3.5, 500);
    scene.add(light);
    light.position.set(POS_X, POS_Y, POS_Z);
}

/**
 * Add the earth.
 */
function addEarth() {
    const earthGeometry = new THREE.SphereGeometry(600, 50, 50);
    const earthTexture = THREE.ImageUtils.loadTexture('assets/world-big-2-grey.jpg');
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        perPixel: false,
        shininess: 0.2
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
}

/**
 * Add clouds.
 */
function addClouds() {
    const cloudsGeometry = new THREE.SphereGeometry(600, 50, 50);
    const cloudsTexture = THREE.ImageUtils.loadTexture('assets/earth_clouds_1024.png');
    const cloudsMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        map: cloudsTexture,
        transparent: true,
        opacity: 0.3
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    cloudsMesh.scale.set(1.015, 1.015, 1.015);
    scene.add(cloudsMesh);
}

/**
 * Convert the positions from a lat, lon to a position on a sphere.
 */
function latLongToVector3(lat, lon, radius, heigth) {
    const phi = (lat) * Math.PI / 180;
    const theta = (lon - 180) * Math.PI / 180;
    const x = -(radius + heigth) * Math.cos(phi) * Math.cos(theta);
    const y = (radius + heigth) * Math.sin(phi);
    const z = (radius + heigth) * Math.cos(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}


/**
 * render the scene.
 */
function render() {
    const timer = Date.now() * 0.0001;
    camera.position.x = (Math.cos(timer) * 1800);
    camera.position.z = (Math.sin(timer) * 1800);
    camera.lookAt(scene.position);
    light.position = camera.position;
    light.lookAt(scene.position);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


/**
 * From http://stackoverflow.com/questions/1293147/javascript-code-to-parse-csv-data
 */
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined
    // If not, then default to comma
    strDelimiter = (strDelimiter || ',');

    // Create a regular expression to parse the CSV values
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


    // Create an array to hold our data. Give the array
    // a default empty first row.
    const arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    let arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        const strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length
            && (strMatchedDelimiter != strDelimiter)
        ) {
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

    // Return the parsed data
    return arrData;
}

// We wait until the document is loaded before loading the density data
$(document).ready(function () {
    jQuery.get('data/density.csv', function (data) {
        addDensity(CSVToArray(data));
        addLights();
        addEarth();
        addClouds();
        render();
    });
});
