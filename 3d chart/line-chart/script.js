let scene, camera, renderer, particles, controls;


function init() {
    THREE.ImageUtils.crossOrigin = '';
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', font => {
        run(font);
    });
}


function run(font) {
    // remove the old three.js chart, d3 chart and datatables table
    $('canvas').remove();
    $('.chartContainer svg').remove();
    const threeData = [];
    let x, y, z, x2, y2;
    for (let i = 0; i < 100; i++) {
        x = (i + 1) * 0.01;
        x2 = 0.0339 * Math.log(x) + 0.0954;
        const h = 100 - i;
        y = (h + 1) * 0.01;
        y2 = -0.0833 * Math.pow(y, 2) + 0.125 * y + 0.0283;
        z = x2 + y2;
        threeData.push([
            (x * 100) - 50,
            (z * 500) - 50,
            (y * 100) - 50
        ]);
    }
    console.log(threeData);
    runThree(threeData, font);
    render();
}


function formatThousands(n) {
    const parts = n.toString().split('.');
    return (parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts[1] ? '.' + parts[1] : ''));
}


function runThree(threeData, font) {
    const worldPosition = [-50, -50, -50];
    const axisScales = [
        [0, 25, 50, 75, 100],
        [0, 5, 10, 15, 20],
        [0, 25, 50, 75, 100]
    ];

    // Create the scene and set the scene size.
    const threeContainer = $('.threeChartContainer');
    const threeHeight = threeContainer.height();
    const threeWidth = threeContainer.width();

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, threeWidth / threeHeight, 0.1, 20000);
    camera.position.set(20, 60, 200);
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(threeWidth, threeHeight);
    renderer.setClearColor(0xecf0f1);
    $('.threeChartContainer').append(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);

    const geometry = new THREE.Geometry();
    const material = new THREE.PointsMaterial({
        color: 0x1a2a32,
        size: 1,
        opacity: 0.7,
        transparent: true,
        sizeAttenuation: true
    });

    // position each particle
    for (let i = 0; i < threeData.length; i++) {
        const vertex = new THREE.Vector3();
        vertex.x = threeData[i][0];
        vertex.y = threeData[i][1];
        vertex.z = threeData[i][2];
        geometry.vertices.push(vertex);
    }

    const lineGeometry = new THREE.Geometry();
    lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], worldPosition[1], worldPosition[2]));
    lineGeometry.vertices.push(new THREE.Vector3((worldPosition[0] + 100), worldPosition[1], worldPosition[2]));
    lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], worldPosition[1], worldPosition[2]));
    lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], (worldPosition[1] + 100), worldPosition[2]));
    lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], worldPosition[1], worldPosition[2]));
    lineGeometry.vertices.push(new THREE.Vector3(worldPosition[0], worldPosition[1], (worldPosition[2] + 100)));

    // create a blue LineBasicMaterial
    let lineMaterial = new THREE.LineBasicMaterial({
        color: 0x444444
    });

    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // create a blue LineBasicMaterial
    lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff4444
    });

    // add axis labels
    let position = [0, -45, -55];
    addText(position, 'Product/Offer Investment %', font, 'middle', 3);
    position = [-75, -45, 0];
    addText(position, 'Brand', font, 'middle', 3);
    position = [-75, -50, 0];
    addText(position, 'Investment %', font, 'middle', 3);
    position = [-75, 0, -50];
    addText(position, '% Customer', font, 'middle', 3);
    position = [-75, -5, -50];
    addText(position, 'Base Driven', font, 'middle', 3);
    position = [-75, -10, -50];
    addText(position, 'by Media', font, 'middle', 3);
    position = [0, 60, -50];
    addText(position, 'BRAND vs PRODUCT MIX', font, 'middle', 4, true);

    particles = new THREE.Points(geometry, material);
    particles.sortParticles = true;
    scene.add(particles);
    let axisIncrement = 100 / (axisScales[0].length - 1);
    let axisStart = worldPosition[0];
    for (let i = 0; i < axisScales[0].length; i++) {
        const position = [axisStart + (axisIncrement * i), (worldPosition[1] + 0.5), worldPosition[2]];
        const text = formatThousands(axisScales[0][i]);
        addText(position, ' ' + text, font, 'left', 1.8);
    }
    axisIncrement = 100 / (axisScales[1].length - 1);
    axisStart = -50;
    for (let i = 1; i < axisScales[1].length; i++) {
        const position = [worldPosition[0] - 1, axisStart + (axisIncrement * i), worldPosition[2]];
        const text = formatThousands(axisScales[1][i]);
        addText(position, text + ' ', font, 'right', 1.8);
    }
    axisIncrement = 100 / (axisScales[2].length - 1);
    axisStart = worldPosition[2];
    for (let i = 1; i < axisScales[2].length; i++) {
        const position = [worldPosition[0] - 1, worldPosition[1], axisStart + (axisIncrement * i)];
        const text = formatThousands(axisScales[0][i]);
        addText(position, text + ' ', font, 'right', 1.8);
    }
}



function render() {
    controls.update();
    // camera.up = new THREE.Vector3(0, 1, 0);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


function addText(position, text, font, anchor, size, underline) {
    const textGeometry = new THREE.TextGeometry(text, {
        size: size,
        height: 0.1,
        curveSegments: 3,
        font: font,
        weight: 'bold',
        style: 'normal',
        bevelEnabled: false
    });
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x444444
    });
    const textMesh = new THREE.Mesh(textGeometry, lineMaterial);
    const box = new THREE.Box3().setFromObject(textMesh);
    const lineGeometry = new THREE.Geometry();

    if (anchor === 'right') {
        textMesh.position.set(position[0] - box.size().x, position[1], position[2]);
    } else {
        if (anchor === 'middle') {
            textMesh.position.set(position[0] - (box.size().x / 2), position[1], position[2]);
        } else {
            textMesh.position.set(position[0], position[1], position[2]);
        }
    }
    if (underline) {
        lineGeometry.vertices.push(new THREE.Vector3(position[0] - (box.size().x / 2), position[1] - 1, position[2]));
        lineGeometry.vertices.push(new THREE.Vector3(position[0] + (box.size().x / 2), position[1] - 1, position[2]));
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);
    }
    scene.add(textMesh);
}


init();
