/*
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}
*/


const container = document.getElementById('container');
const windowWidth = $('#container').innerWidth();
const windowHeight = $('#container').innerHeight();

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(40, windowWidth / windowHeight, 1, 30000);

// Vị trí bắt đầu
const startPosition = new THREE.Vector3(0, 0, 3000);
const stats = new Stats();

// Đối tượng OrbitControls
const controls = new THREE.OrbitControls(camera);

// Mảng các phần tử
// Mỗi phần tử là một mảng 3 giá trị
let realData;

const data = {
    // Nhãn của các trục
    labels: {
        y: ['2%', '4%', '6%', '8%'],
        x: ['', "'14", "'13", "'12", "'11", "'10", "'09", "'08", "'07", "'06", "'05"],
        z: ['1-month', '3-month', '6-month', '1-year', '2-year', '3-year', '5-year', '7-year', '10-year', '20-year', '30-year']
    }
};

// Các kích thước các trục
const graphDimensions = {
    w: 1000, // width
    d: 2405, // depth
    h: 800 // height
};


function labelAxis(width, data, direction) {
    const separator = 2 * width / data.length;
    const p = {
        x: 0,
        y: 0,
        z: 0
    };
    const dobj = new THREE.Object3D();
    for (let i = 0; i < data.length; i++) {
        const label = makeTextSprite(data[i]);
        label.position.set(p.x, p.y, p.z);
        dobj.add(label);
        if (direction == 'y') {
            p[direction] += separator;
        } else {
            p[direction] -= separator;
        }
    }
    return dobj;
}


/**
 * This was written by Lee Stemkoski.
 * https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
 */
function makeTextSprite(message, parameters) {
    if (parameters === undefined) {
        parameters = {};
    }

    const fontface = parameters.fontface || 'Helvetica';
    const fontsize = parameters.fontsize || 70;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + 'px ' + fontface;

    // Text color
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.fillText(message, 0, fontsize);

    // Canvas contents will be used for a texture
    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        useScreenCoordinates: false
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(100, 50, 1.0);
    return sprite;
}


function createAGrid(opts) {
    const config = opts || {
        height: 500,
        width: 500,
        linesHeight: 10,
        linesWidth: 10,
        color: 0xDD006C
    };

    const material = new THREE.LineBasicMaterial({
        color: config.color,
        opacity: 0.2
    });

    const gridGeometry = new THREE.Geometry();
    const stepWidth = 2 * config.width / config.linesWidth;
    const stepHeight = 2 * config.height / config.linesHeight;

    for (let i = -config.width; i <= config.width; i += stepWidth) {
        gridGeometry.vertices.push(new THREE.Vector3(-config.height, i, 0));
        gridGeometry.vertices.push(new THREE.Vector3(config.height, i, 0));
    }

    for (let i = -config.height; i <= config.height; i += stepHeight) {
        gridGeometry.vertices.push(new THREE.Vector3(i, -config.width, 0));
        gridGeometry.vertices.push(new THREE.Vector3(i, config.width, 0));
    }

    const line = new THREE.Line(gridGeometry, material, THREE.LinePieces);

    const gridObject = new THREE.Object3D();
    gridObject.add(line);
    return gridObject;
}


/**
 * Vẽ các trục.
 */
function initGrid() {
    const boundingGrid = new THREE.Object3D();

    const depth = graphDimensions.w / 2; // depth
    const width = graphDimensions.d / 2; // width
    const height = graphDimensions.h / 2; // height

    const a = data.labels.y.length;
    const b = data.labels.x.length;
    const c = data.labels.z.length;

    // pink
    const newGridXY = createAGrid({
        height: width,
        width: height,
        linesHeight: b,
        linesWidth: a,
        color: 0xcccccc
    });
    // newGridXY.position.y = height;
    newGridXY.position.z = -depth;
    boundingGrid.add(newGridXY);

    // blue
    const newGridYZ = createAGrid({
        height: width,
        width: depth,
        linesHeight: b,
        linesWidth: c,
        color: 0xcccccc
    });
    newGridYZ.rotation.x = Math.PI / 2;
    newGridYZ.position.y = -height;
    boundingGrid.add(newGridYZ);

    // green
    const newGridXZ = createAGrid({
        height: depth,
        width: height,
        linesHeight: c,
        linesWidth: a,
        color: 0xcccccc
    });
    newGridXZ.position.x = width;
    // newGridXZ.position.y = height;
    newGridXZ.rotation.y = Math.PI / 2;
    boundingGrid.add(newGridXZ);

    scene.add(boundingGrid);

    // Các nhãn của các trục
    const labelsW = labelAxis(width, data.labels.x, 'x');
    labelsW.position.x = width + 40;
    labelsW.position.y = -height - 40;
    labelsW.position.z = depth;
    scene.add(labelsW);

    const labelsH = labelAxis(height, data.labels.y, 'y');
    labelsH.position.x = width;
    labelsH.position.y = -height + (2 * height / a) - 20;
    labelsH.position.z = depth;
    scene.add(labelsH);

    const labelsD = labelAxis(depth, data.labels.z, 'z');
    labelsD.position.x = width;
    labelsD.position.y = -(height) - 40;
    labelsD.position.z = depth - 40;
    scene.add(labelsD);
}


function init() {
    camera.position.set(startPosition.x, startPosition.y, startPosition.z);

    controls.damping = 0.2;
    controls.addEventListener('change', render);

    // Add a light source
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    scene.add(light);

    initGrid();


    const wireframeMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors
    });

    const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff
    });
    const blacklineMat = new THREE.LineBasicMaterial({
        color: 0x000000
    });

    const floorGeometry = new THREE.PlaneGeometry(graphDimensions.w, graphDimensions.d, 10, 2405);
    const colors = ['#eef4f8', '#ddecf4', '#cce5f0', '#bcddec', '#aed5e7', '#a0cde2', '#94c5dc', '#89bcd6', '#7eb4d0', '#74abc9', '#6aa2c2', '#619abb', '#5892b4', '#4f8aad', '#4781a6', '#3f799f', '#3a7195', '#35688c', '#326082', '#2f5877', '#2c506c', '#243d52'];
    const faceColors = [];
    const lines = {};

    // on plane Geometry, change the z value to create the 3D area surface
    // just like when creating a terrain
    for (let i = 0; i < floorGeometry.vertices.length; i++) {
        // push colors to the faceColors array
        faceColors.push(colors[Math.round(realData[i][2] * 4)]);

        if (realData[i][2] == null) {
            // hack hack hack
            floorGeometry.vertices[i].z = 'null';
        } else {
            floorGeometry.vertices[i].z = realData[i][2] * 100;
            if (!lines[floorGeometry.vertices[i].x]) {
                lines[floorGeometry.vertices[i].x] = new THREE.Geometry();
            }
            // arrays for the grid lines
            lines[floorGeometry.vertices[i].x].vertices.push(new THREE.Vector3(floorGeometry.vertices[i].x, floorGeometry.vertices[i].y, realData[i][2] * 100));
        }
    }

    // vertexColors
    for (let x = 0; x < floorGeometry.faces.length; x++) {
        floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
        floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
        floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
    }

    // grid lines
    for (line in lines) {
        if (line == '-500') {
            var graphLine = new THREE.Line(lines[line], blacklineMat);
        } else {
            var graphLine = new THREE.Line(lines[line], lineMat);
        }

        graphLine.rotation.x = -Math.PI / 2;
        graphLine.position.y = -graphDimensions.h / 2;

        graphLine.rotation.z = Math.PI / 2;

        scene.add(graphLine);
    }


    const floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -graphDimensions.h / 2;

    floor.rotation.z = Math.PI / 2;
    scene.add(floor);



    // Setup WebGL renderer
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf0f0f0);
    renderer.setSize(windowWidth, windowHeight);
    container.appendChild(renderer.domElement);

    // Setup Stats
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.right = '10px';
    container.appendChild(stats.domElement);

    // Setup window resize listener
    window.addEventListener('resize', onWindowResize);

    animate();
}


function animate() {
    controls.update();
    // render();
    requestAnimationFrame(animate);
}


function render() {
    stats.update();
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(windowWidth, windowHeight);
    render();
}


async function main() {
    const data = await fetch('data/2005-2015.json').then(resp => resp.json());
    realData = data;
    // console.log(data);
    init();
    render();
}


/**
 * Các tùy chọn với Camera.
 */
function bindHandlers() {
    $('.buttons').bind('click', function () {
        const type = $(this).attr('id');
        if (type == 'camera-1') {
            console.log('camera one');
            controls.reset();
            const vFOVRadians = 2 * Math.atan(windowHeight / (2 * 35000));
            const fov = vFOVRadians * 180 / Math.PI;
            camera.fov = fov;
            controls.rotateUp(90 * Math.PI / 180);
            camera.position.z = startPosition.z * 23;
            camera.position.y = (startPosition.z) * 55;
            camera.far = 1000000;
            camera.updateProjectionMatrix();
            console.log(camera.position.y);
            render();
        }

        if (type == 'camera-2') {
            console.log('camera two');
            controls.reset();

            const vFOVRadians = 2 * Math.atan(windowHeight / (2 * 35000));
            const fov = vFOVRadians * 180 / Math.PI;
            camera.fov = fov;
            camera.position.z = startPosition.z * 58;
            camera.far = 1000000;
            camera.updateProjectionMatrix();
            render();
        }

        if (type == 'camera-3') {
            console.log('camera three');
            controls.reset();
            camera.fov = 30;
            camera.updateProjectionMatrix();
            render();
        }
    });
}


main();
bindHandlers();
