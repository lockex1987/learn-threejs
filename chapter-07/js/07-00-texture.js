import * as THREE from 'three';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


function getObjectsKeys(obj) {
    const keys = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }
    return keys;
}


const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();


const envMaps = (function () {
    const path = '../textures/cube/SwedishRoyalCastle/';
    const format = '.jpg';
    const urls = [
        path + 'px' + format,
        path + 'nx' + format,
        path + 'py' + format,
        path + 'ny' + format,
        path + 'pz' + format,
        path + 'nz' + format
    ];
    const reflectionCube = cubeTextureLoader.load(urls);
    const refractionCube = cubeTextureLoader.load(urls);
    refractionCube.mapping = THREE.CubeRefractionMapping;
    return {
        none: null,
        reflection: reflectionCube,
        refraction: refractionCube
    };
})();


const diffuseMaps = (function () {
    const bricks = textureLoader.load('../textures/brick_diffuse.jpg');
    bricks.wrapS = THREE.RepeatWrapping;
    bricks.wrapT = THREE.RepeatWrapping;
    bricks.repeat.set(9, 1);
    return {
        none: null,
        bricks: bricks
    };
})();


const roughnessMaps = (function () {
    const bricks = textureLoader.load('../textures/brick_roughness.jpg');
    bricks.wrapT = THREE.RepeatWrapping;
    bricks.wrapS = THREE.RepeatWrapping;
    bricks.repeat.set(9, 1);

    return {
        none: null,
        bricks: bricks
    };
})();


const matcaps = (function () {
    return {
        none: null,
        porcelainWhite: textureLoader.load('../textures/matcaps/matcap-porcelain-white.jpg')
    };
})();


const alphaMaps = (function () {
    const fibers = textureLoader.load('../textures/alphaMap.jpg');
    fibers.wrapT = THREE.RepeatWrapping;
    fibers.wrapS = THREE.RepeatWrapping;
    fibers.repeat.set(9, 1);
    return {
        none: null,
        fibers: fibers
    };
})();


const gradientMaps = (function () {
    const threeTone = textureLoader.load('../textures/gradientMaps/threeTone.jpg');
    threeTone.minFilter = THREE.NearestFilter;
    threeTone.magFilter = THREE.NearestFilter;

    const fiveTone = textureLoader.load('../textures/gradientMaps/fiveTone.jpg');
    fiveTone.minFilter = THREE.NearestFilter;
    fiveTone.magFilter = THREE.NearestFilter;

    return {
        none: null,
        threeTone: threeTone,
        fiveTone: fiveTone
    };
})();


const envMapKeys = getObjectsKeys(envMaps);
const diffuseMapKeys = getObjectsKeys(diffuseMaps);
const roughnessMapKeys = getObjectsKeys(roughnessMaps);
const matcapKeys = getObjectsKeys(matcaps);
const alphaMapKeys = getObjectsKeys(alphaMaps);
const gradientMapKeys = getObjectsKeys(gradientMaps);




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


function updateTexture(material, materialKey, textures) {
    return function (key) {
        material[materialKey] = textures[key];
        material.needsUpdate = true;
    };
}


function guiMeshBasicMaterial(gui, material, geometry) {
    const data = {
        map: diffuseMapKeys[0],
        envMaps: envMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshBasicMaterial');
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshDepthMaterial(gui, material, camera) {
    const data = {
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshDepthMaterial');
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshLambertMaterial(gui, material, geometry, lights) {
    const data = {
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshLambertMaterial');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshMatcapMaterial(gui, material, geometry) {
    const data = {
        color: material.color.getHex(),
        matcap: matcapKeys[1],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshMatcapMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.add(data, 'matcap', matcapKeys).onChange(updateTexture(material, 'matcap', matcaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshPhongMaterial(gui, material, geometry) {
    const data = {
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshPhongMaterial');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshToonMaterial(gui, material) {
    const data = {
        gradientMap: gradientMapKeys[1],
        map: diffuseMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshToonMaterial');
    folder.add(data, 'gradientMap', gradientMapKeys).onChange(updateTexture(material, 'gradientMap', gradientMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshStandardMaterial(gui, material, geometry) {
    const data = {
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[1],
        roughnessMap: roughnessMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshStandardMaterial');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'roughnessMap', roughnessMapKeys).onChange(updateTexture(material, 'roughnessMap', roughnessMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshPhysicalMaterial(gui, material, geometry) {
    const data = {
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        roughnessMap: roughnessMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshPhysicalMaterial');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'roughnessMap', roughnessMapKeys).onChange(updateTexture(material, 'roughnessMap', roughnessMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

    // TODO metalnessMap
}


/**
 * Tạo Material.
 */
function createMaterial(selectedMaterial, gui, mesh, geometry, camera, lights) {
    const [
        ,
        pointLight1,
        pointLight2,
        pointLight3
    ] = lights ?? [null, null, null, null];
    let material;
    const defaultColor = 0x049EF4;

    switch (selectedMaterial) {
    case 'MeshBasicMaterial':
        material = new THREE.MeshBasicMaterial({
            color: defaultColor
        });
        guiMeshBasicMaterial(gui, material, geometry);
        return material;

    case 'MeshDepthMaterial':
        material = new THREE.MeshDepthMaterial();
        guiMeshDepthMaterial(gui, material, camera);
        return material;

    case 'MeshLambertMaterial':
        material = new THREE.MeshLambertMaterial({
            color: defaultColor
        });
        guiMeshLambertMaterial(gui, material, geometry, lights);
        return material;

    case 'MeshPhongMaterial':
        material = new THREE.MeshPhongMaterial({
            color: defaultColor,
            specular: defaultColor
            // specular: 0x444444
        });
        guiMeshPhongMaterial(gui, material, geometry);
        return material;

    case 'MeshToonMaterial':
        material = new THREE.MeshToonMaterial({
            color: defaultColor
            // gradientMap: gradientMaps.threeTone
        });

        guiMeshToonMaterial(gui, material);

        // Chỉ sử dụng một PointLight
        pointLight1.visible = false;
        pointLight3.visible = false;

        return material;

    case 'MeshStandardMaterial':
        material = new THREE.MeshStandardMaterial({
            map: diffuseMaps.bricks
        });
        guiMeshStandardMaterial(gui, material, geometry);

        // Chỉ sử dụng AmbientLight
        // pointLight1.visible = false;
        // pointLight2.visible = false;
        // pointLight3.visible = false;

        return material;

    case 'MeshPhysicalMaterial':
        material = new THREE.MeshPhysicalMaterial({
            color: defaultColor,
            roughness: 0,
            metalness: 1
        });
        guiMeshPhysicalMaterial(gui, material, geometry);

        // Chỉ sử dụng AmbientLight
        // pointLight1.visible = false;
        // pointLight2.visible = false;
        // pointLight3.visible = false;

        return material;

    case 'MeshMatcapMaterial':
        material = new THREE.MeshMatcapMaterial({
            matcap: matcaps.porcelainWhite
        });
        guiMeshMatcapMaterial(gui, material, geometry);
        // no need for lights
        pointLight1.visible = false;
        pointLight2.visible = false;
        pointLight3.visible = false;
        return material;
    }
}


function addLights(scene) {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffffff, 1, 0);
    pointLight1.position.set(0, 200, 0);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 0);
    pointLight2.position.set(100, 200, 100);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 1, 0);
    pointLight3.position.set(-100, -200, -100);
    scene.add(pointLight3);

    return [
        ambientLight,
        pointLight1,
        pointLight2,
        pointLight3
    ];
}


function init() {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webglOutput'),
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xDDDDDD);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 100);
    camera.position.z = 35;

    const gui = new GUI();

    const geometry = new THREE.TorusKnotGeometry(7, 1, 50, 8);

    let mesh;
    const selectedMaterial = window.location.hash.substring(1) || 'MeshStandardMaterial';

    document.title = 'Ví dụ ' + selectedMaterial;

    let lights;
    if (!['MeshBasicMaterial', 'MeshDepthMaterial', 'MeshMatcapMaterial'].includes(selectedMaterial)) {
        console.log('Thêm ánh sáng');
        lights = addLights(scene);
    }

    if (selectedMaterial == 'Combine') {
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
        mesh.material = createMaterial(selectedMaterial, gui, mesh, geometry, camera, lights);
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
