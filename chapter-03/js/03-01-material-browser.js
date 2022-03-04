import * as THREE from 'three';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


/**
 * Xử lý khi người dùng chọn lại màu sắc trên GUI.
 * @param {THREE.Color} color Đối tượng màu sắc
 * @returns {Function} Hàm để truyền vào onChange của GUI
 */
function handleColorChange(color) {
    return function (value) {
        if (typeof value === 'string') {
            value = value.replace('#', '0x');
        }
        color.setHex(value);
    };
}


function guiMeshBasicMaterial(gui, material) {
    const data = {
        color: material.color.getHex()
    };
    const folder = gui.addFolder('MeshBasicMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
    folder.add(material, 'wireframe');
}


function guiMeshDepthMaterial(gui, camera) {
    const data = {
        cameraNear: camera.near,
        cameraFar: camera.far
    };
    const folder = gui.addFolder('MeshDepthMaterial');
    folder.add(data, 'cameraNear', 0, 100)
        .onChange(value => {
            camera.near = value;
            camera.updateProjectionMatrix();
        });
    folder.add(data, 'cameraFar', 50, 200)
        .onChange(value => {
            camera.far = value;
            camera.updateProjectionMatrix();
        });
}


function guiMeshNormalMaterial(gui, material) {
    const folder = gui.addFolder('MeshNormalMaterial');
    folder.add(material, 'flatShading')
        .onChange(() => {
            material.needsUpdate = true;
        });
}


function guiMeshLambertMaterial(gui, material, lights) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        light: true
    };
    const folder = gui.addFolder('MeshLambertMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive')
        .onChange(handleColorChange(material.emissive));
    folder.add(data, 'light')
        .onChange((value) => {
            lights.forEach(light => {
                light.visible = value;
            });
        });
}


function guiMeshPhongMaterial(gui, material) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        specular: material.specular.getHex()
    };
    const folder = gui.addFolder('MeshPhongMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive')
        .onChange(handleColorChange(material.emissive));
    folder.addColor(data, 'specular')
        .onChange(handleColorChange(material.specular));
    folder.add(material, 'shininess', 0, 100);
}


function guiMeshToonMaterial(gui, material) {
    const data = {
        color: material.color.getHex()
    };
    const folder = gui.addFolder('MeshToonMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
}


function guiMeshStandardMaterial(gui, material) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
    };

    const folder = gui.addFolder('MeshStandardMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive')
        .onChange(handleColorChange(material.emissive));
    folder.add(material, 'roughness', 0, 1);
    folder.add(material, 'metalness', 0, 1);
}


function guiMeshPhysicalMaterial(gui, material) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex()
    };
    const folder = gui.addFolder('MeshPhysicalMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive')
        .onChange(handleColorChange(material.emissive));
    folder.add(material, 'roughness', 0, 1);
    folder.add(material, 'metalness', 0, 1);
    folder.add(material, 'reflectivity', 0, 1);
    folder.add(material, 'clearcoat', 0, 1)
        .step(0.01);
    folder.add(material, 'clearcoatRoughness', 0, 1)
        .step(0.01);
}


/**
 * Tạo Material.
 */
function createMaterial(selectedMaterial, camera, lights) {
    const [
        ,
        pointLight1,
        ,
        pointLight3
    ] = lights ?? [null, null, null, null];
    const gui = new GUI();
    const defaultColor = 0x049EF4;
    let material;

    switch (selectedMaterial) {
    case 'MeshBasicMaterial':
        material = new THREE.MeshBasicMaterial({
            color: defaultColor
        });
        guiMeshBasicMaterial(gui, material);
        return material;

    case 'MeshDepthMaterial':
        material = new THREE.MeshDepthMaterial();
        guiMeshDepthMaterial(gui, camera);
        return material;

    case 'MeshNormalMaterial':
        material = new THREE.MeshNormalMaterial({
            flatShading: true
        });
        guiMeshNormalMaterial(gui, material);
        return material;

    case 'MeshLambertMaterial':
        material = new THREE.MeshLambertMaterial({
            color: defaultColor
        });
        guiMeshLambertMaterial(gui, material, lights);
        return material;

    case 'MeshPhongMaterial':
        material = new THREE.MeshPhongMaterial({
            color: defaultColor,
            specular: defaultColor
            // specular: 0x444444
        });
        guiMeshPhongMaterial(gui, material);
        return material;

    case 'MeshToonMaterial':
        material = new THREE.MeshToonMaterial({
            color: defaultColor
        });
        guiMeshToonMaterial(gui, material);
        // Chỉ sử dụng một PointLight
        pointLight1.visible = false;
        pointLight3.visible = false;
        return material;

    case 'MeshStandardMaterial':
        material = new THREE.MeshStandardMaterial({
            color: defaultColor,
            emissive: defaultColor,
            roughness: 0,
            metalness: 1
        });
        guiMeshStandardMaterial(gui, material);
        return material;

    case 'MeshPhysicalMaterial':
        material = new THREE.MeshPhysicalMaterial({
            color: defaultColor,
            emissive: defaultColor,
            roughness: 0,
            metalness: 1
        });
        guiMeshPhysicalMaterial(gui, material);
        return material;
    }
}


function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0x000000);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 0);
    pointLight1.position.set(0, 100, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0);
    pointLight2.position.set(50, 100, 50);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1, 0);
    pointLight3.position.set(-50, -100, -50);
    scene.add(pointLight3);

    return [
        ambientLight,
        pointLight1,
        pointLight2,
        pointLight3
    ];
}


function init() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xDDDDDD);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 100);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webglOutput'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.TorusKnotGeometry(7, 1, 50, 8);
    const selectedMaterialName = window.location.hash.substring(1) || 'MeshBasicMaterial';

    document.title = 'Ví dụ ' + selectedMaterialName;

    let lights;
    if (!['MeshBasicMaterial', 'MeshDepthMaterial', 'MeshNormalMaterial'].includes(selectedMaterialName)) {
        console.log('Thêm ánh sáng');
        lights = addLights(scene);
    }

    let mesh;

    if (selectedMaterialName == 'Combine') {
        // Kết hợp nhiều Material
        const depthMaterial = new THREE.MeshDepthMaterial();
        const basicMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            blending: THREE.MultiplyBlending
        });
        const materials = [
            basicMaterial,
            depthMaterial
        ];

        // Tham khảo THREE.SceneUtils.createMultiMaterialObject
        mesh = new THREE.Group();
        materials.forEach(material => {
            mesh.add(new THREE.Mesh(geometry, material));
        });
    } else {
        mesh = new THREE.Mesh(geometry);
        mesh.material = createMaterial(selectedMaterialName, camera, lights);
    }

    scene.add(mesh);

    function update() {
        mesh.rotation.x += 0.005;
        mesh.rotation.y += 0.005;
    }

    function render() {
        update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render();

    window.addEventListener('resize', () => {
        onResize();
    });
}


init();
