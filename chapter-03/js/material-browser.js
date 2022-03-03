import * as THREE from 'three';
// import { GUI } from 'https://threejs.org/examples/jsm/libs/lil-gui.module.min.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import { RoomEnvironment } from 'https://threejs.org/examples/jsm/environments/RoomEnvironment.js';


const constants = {
    combine: {
        'THREE.MultiplyOperation': THREE.MultiplyOperation,
        'THREE.MixOperation': THREE.MixOperation,
        'THREE.AddOperation': THREE.AddOperation
    },

    side: {
        'THREE.FrontSide': THREE.FrontSide,
        'THREE.BackSide': THREE.BackSide,
        'THREE.DoubleSide': THREE.DoubleSide
    },

    blendingMode: {
        'THREE.NoBlending': THREE.NoBlending,
        'THREE.NormalBlending': THREE.NormalBlending,
        'THREE.AdditiveBlending': THREE.AdditiveBlending,
        'THREE.SubtractiveBlending': THREE.SubtractiveBlending,
        'THREE.MultiplyBlending': THREE.MultiplyBlending,
        'THREE.CustomBlending': THREE.CustomBlending
    },

    equations: {
        'THREE.AddEquation': THREE.AddEquation,
        'THREE.SubtractEquation': THREE.SubtractEquation,
        'THREE.ReverseSubtractEquation': THREE.ReverseSubtractEquation
    },

    destinationFactors: {
        'THREE.ZeroFactor': THREE.ZeroFactor,
        'THREE.OneFactor': THREE.OneFactor,
        'THREE.SrcColorFactor': THREE.SrcColorFactor,
        'THREE.OneMinusSrcColorFactor': THREE.OneMinusSrcColorFactor,
        'THREE.SrcAlphaFactor': THREE.SrcAlphaFactor,
        'THREE.OneMinusSrcAlphaFactor': THREE.OneMinusSrcAlphaFactor,
        'THREE.DstAlphaFactor': THREE.DstAlphaFactor,
        'THREE.OneMinusDstAlphaFactor': THREE.OneMinusDstAlphaFactor
    },

    sourceFactors: {
        'THREE.DstColorFactor': THREE.DstColorFactor,
        'THREE.OneMinusDstColorFactor': THREE.OneMinusDstColorFactor,
        'THREE.SrcAlphaSaturateFactor': THREE.SrcAlphaSaturateFactor
    }
};


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


function generateVertexColors(geometry) {
    const positionAttribute = geometry.attributes.position;
    const colors = [];
    const color = new THREE.Color();
    for (let i = 0, il = positionAttribute.count; i < il; i++) {
        color.setHSL(i / il * Math.random(), 0.5, 0.5);
        colors.push(color.r, color.g, color.b);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}


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


function needsUpdate(material, geometry) {
    return function () {
        material.side = parseInt(material.side); // Ensure number
        material.needsUpdate = true;
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.normal.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    };
}


function updateCombine(material) {
    return function (combine) {
        material.combine = parseInt(combine);
        material.needsUpdate = true;
    };
}


function updateTexture(material, materialKey, textures) {
    return function (key) {
        material[materialKey] = textures[key];
        material.needsUpdate = true;
    };
}


function guiScene(gui, scene) {
    const folder = gui.addFolder('Scene');
    const data = {
        background: '#000000',
        'ambient light': ambientLight.color.getHex()
    };
    folder.addColor(data, 'ambient light').onChange(handleColorChange(ambientLight.color));
    guiSceneFog(folder, scene);
}


function guiSceneFog(folder, scene) {
    const fogFolder = folder.addFolder('scene.fog');
    const fog = new THREE.Fog(0x3f7b9d, 0, 60);
    const data = {
        fog: {
            'THREE.Fog()': false,
            'scene.fog.color': fog.color.getHex()
        }
    };
    fogFolder.add(data.fog, 'THREE.Fog()')
        .onChange(function (useFog) {
            if (useFog) {
                scene.fog = fog;
            } else {
                scene.fog = null;
            }
        });
    fogFolder.addColor(data.fog, 'scene.fog.color')
        .onChange(handleColorChange(fog.color));
}


function guiMaterial(gui, material, geometry) {
    const folder = gui.addFolder('Material');

    folder.add(material, 'transparent');
    folder.add(material, 'opacity', 0, 1).step(0.01);
    // folder.add( material, 'blending', constants.blendingMode );
    // folder.add( material, 'blendSrc', constants.destinationFactors );
    // folder.add( material, 'blendDst', constants.destinationFactors );
    // folder.add( material, 'blendEquation', constants.equations );
    folder.add(material, 'depthTest');
    folder.add(material, 'depthWrite');
    // folder.add( material, 'polygonOffset' );
    // folder.add( material, 'polygonOffsetFactor' );
    // folder.add( material, 'polygonOffsetUnits' );
    folder.add(material, 'alphaTest', 0, 1).step(0.01).onChange(needsUpdate(material, geometry));
    folder.add(material, 'visible');
    folder.add(material, 'side', constants.side).onChange(needsUpdate(material, geometry));
}


function guiMeshBasicMaterial(gui, material, geometry) {
    const data = {
        color: material.color.getHex()
        // envMaps: envMapKeys[0],
        // map: diffuseMapKeys[0],
        // alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('MeshBasicMaterial');
    folder.addColor(data, 'color')
        .onChange(handleColorChange(material.color));
    folder.add(material, 'wireframe');
    // folder.add(material, 'vertexColors').onChange(needsUpdate(material, geometry));
    // folder.add(material, 'fog');
    // folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    // folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    // folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
    // folder.add(material, 'combine', constants.combine).onChange(updateCombine(material));
    // folder.add(material, 'reflectivity', 0, 1);
    // folder.add(material, 'refractionRatio', 0, 1);
}


function guiMeshDepthMaterial(gui, material, camera) {
    const data = {
        // alphaMap: alphaMapKeys[0],
        cameraNear: camera.near,
        cameraFar: camera.far
    };
    const folder = gui.addFolder('MeshDepthMaterial');
    // folder.add(material, 'wireframe');
    // folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
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


function guiMeshNormalMaterial(gui, mesh, material, geometry) {
    const folder = gui.addFolder('THREE.MeshNormalMaterial');
    folder.add(material, 'flatShading').onChange(needsUpdate(material, geometry));
    folder.add(material, 'wireframe');
}


function guiLineBasicMaterial(gui, mesh, material, geometry) {
    const data = {
        color: material.color.getHex()
    };
    const folder = gui.addFolder('THREE.LineBasicMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.add(material, 'linewidth', 0, 10);
    folder.add(material, 'linecap', ['butt', 'round', 'square']);
    folder.add(material, 'linejoin', ['round', 'bevel', 'miter']);
    folder.add(material, 'vertexColors').onChange(needsUpdate(material, geometry));
    folder.add(material, 'fog');
}


function guiMeshLambertMaterial(gui, mesh, material, geometry) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('THREE.MeshLambertMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    folder.add(material, 'wireframe');
    folder.add(material, 'vertexColors').onChange(needsUpdate(material, geometry));
    folder.add(material, 'fog');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
    folder.add(material, 'combine', constants.combine).onChange(updateCombine(material));
    folder.add(material, 'reflectivity', 0, 1);
    folder.add(material, 'refractionRatio', 0, 1);
}


function guiMeshMatcapMaterial(gui, mesh, material, geometry) {
    const data = {
        color: material.color.getHex(),
        matcap: matcapKeys[1],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('THREE.MeshMatcapMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.add(material, 'flatShading').onChange(needsUpdate(material, geometry));
    folder.add(data, 'matcap', matcapKeys).onChange(updateTexture(material, 'matcap', matcaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshPhongMaterial(gui, mesh, material, geometry) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        specular: material.specular.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('THREE.MeshPhongMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    folder.addColor(data, 'specular').onChange(handleColorChange(material.specular));
    folder.add(material, 'shininess', 0, 100);
    folder.add(material, 'flatShading').onChange(needsUpdate(material, geometry));
    folder.add(material, 'wireframe');
    folder.add(material, 'vertexColors').onChange(needsUpdate(material, geometry));
    folder.add(material, 'fog');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
    folder.add(material, 'combine', constants.combine).onChange(updateCombine(material));
    folder.add(material, 'reflectivity', 0, 1);
    folder.add(material, 'refractionRatio', 0, 1);
}


function guiMeshToonMaterial(gui, mesh, material) {
    const data = {
        color: material.color.getHex(),
        map: diffuseMapKeys[0],
        gradientMap: gradientMapKeys[1],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('THREE.MeshToonMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'gradientMap', gradientMapKeys).onChange(updateTexture(material, 'gradientMap', gradientMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));
}


function guiMeshStandardMaterial(gui, mesh, material, geometry) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        roughnessMap: roughnessMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };

    const folder = gui.addFolder('THREE.MeshStandardMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    folder.add(material, 'roughness', 0, 1);
    folder.add(material, 'metalness', 0, 1);
    folder.add(material, 'flatShading').onChange(needsUpdate(material, geometry));
    folder.add(material, 'wireframe');
    folder.add(material, 'vertexColors').onChange(needsUpdate(material, geometry));
    folder.add(material, 'fog');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'roughnessMap', roughnessMapKeys).onChange(updateTexture(material, 'roughnessMap', roughnessMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

    // TODO metalnessMap
}


function guiMeshPhysicalMaterial(gui, mesh, material, geometry) {
    const data = {
        color: material.color.getHex(),
        emissive: material.emissive.getHex(),
        envMaps: envMapKeys[0],
        map: diffuseMapKeys[0],
        roughnessMap: roughnessMapKeys[0],
        alphaMap: alphaMapKeys[0]
    };
    const folder = gui.addFolder('THREE.MeshPhysicalMaterial');
    folder.addColor(data, 'color').onChange(handleColorChange(material.color));
    folder.addColor(data, 'emissive').onChange(handleColorChange(material.emissive));
    folder.add(material, 'roughness', 0, 1);
    folder.add(material, 'metalness', 0, 1);
    folder.add(material, 'reflectivity', 0, 1);
    folder.add(material, 'clearcoat', 0, 1).step(0.01);
    folder.add(material, 'clearcoatRoughness', 0, 1).step(0.01);
    folder.add(material, 'flatShading').onChange(needsUpdate(material, geometry));
    folder.add(material, 'wireframe');
    folder.add(material, 'vertexColors').onChange(needsUpdate(material, geometry));
    folder.add(material, 'fog');
    folder.add(data, 'envMaps', envMapKeys).onChange(updateTexture(material, 'envMap', envMaps));
    folder.add(data, 'map', diffuseMapKeys).onChange(updateTexture(material, 'map', diffuseMaps));
    folder.add(data, 'roughnessMap', roughnessMapKeys).onChange(updateTexture(material, 'roughnessMap', roughnessMaps));
    folder.add(data, 'alphaMap', alphaMapKeys).onChange(updateTexture(material, 'alphaMap', alphaMaps));

    // TODO metalnessMap
}


/**
 * Chọn Material.
 */
function chooseFromHash(selectedMaterial, gui, mesh, geometry) {
    document.title = 'Ví dụ ' + selectedMaterial;
    let material;
    const defaultColor = 0x049EF4;

    switch (selectedMaterial) {
    case 'MeshBasicMaterial':
        material = new THREE.MeshBasicMaterial({
            color: defaultColor
        });
        // guiMaterial(gui, material, geometry);
        guiMeshBasicMaterial(gui, material, geometry);
        return material;

    case 'MeshDepthMaterial':
        material = new THREE.MeshDepthMaterial();
        // guiMaterial(gui, material, geometry);
        guiMeshDepthMaterial(gui, material, camera);
        return material;

    case 'MeshLambertMaterial':
        material = new THREE.MeshLambertMaterial({
            color: defaultColor
        });
        guiMaterial(gui, material, geometry);
        guiMeshLambertMaterial(gui, mesh, material, geometry);
        return material;

    case 'MeshMatcapMaterial' :
        material = new THREE.MeshMatcapMaterial({
            matcap: matcaps.porcelainWhite
        });
        guiMaterial(gui, material, geometry);
        guiMeshMatcapMaterial(gui, mesh, material, geometry);
        // no need for lights
        light1.visible = false;
        light2.visible = false;
        light3.visible = false;
        return material;

    case 'MeshPhongMaterial':
        material = new THREE.MeshPhongMaterial({
            color: defaultColor
        });
        guiMaterial(gui, material, geometry);
        guiMeshPhongMaterial(gui, mesh, material, geometry);
        return material;

    case 'MeshToonMaterial':
        material = new THREE.MeshToonMaterial({
            color: defaultColor,
            gradientMap: gradientMaps.threeTone
        });
        guiMaterial(gui, material, geometry);
        guiMeshToonMaterial(gui, mesh, material);
        // only use a single point light
        light1.visible = false;
        light3.visible = false;
        return material;

    case 'MeshStandardMaterial':
        material = new THREE.MeshStandardMaterial({
            color: defaultColor
        });
        guiMaterial(gui, material, geometry);
        guiMeshStandardMaterial(gui, mesh, material, geometry);
        // only use scene environment
        light1.visible = false;
        light2.visible = false;
        light3.visible = false;
        return material;

    case 'MeshPhysicalMaterial':
        material = new THREE.MeshPhysicalMaterial({
            color: defaultColor
        });
        guiMaterial(gui, material, geometry);
        guiMeshPhysicalMaterial(gui, mesh, material, geometry);
        // only use scene environment
        light1.visible = false;
        light2.visible = false;
        light3.visible = false;
        return material;

    case 'MeshNormalMaterial':
        material = new THREE.MeshNormalMaterial();
        guiMaterial(gui, material, geometry);
        guiMeshNormalMaterial(gui, mesh, material, geometry);
        return material;

    case 'LineBasicMaterial':
        material = new THREE.LineBasicMaterial({
            color: 0x2194CE
        });
        guiMaterial(gui, material, geometry);
        guiLineBasicMaterial(gui, mesh, material, geometry);
        return material;
    }
}

//

const gui = new GUI();

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 10, 100);
camera.position.z = 35;

const ambientLight = new THREE.AmbientLight(0x000000);
scene.add(ambientLight);

const light1 = new THREE.PointLight(0xffffff, 1, 0);
light1.position.set(0, 200, 0);
scene.add(light1);

const light2 = new THREE.PointLight(0xffffff, 1, 0);
light2.position.set(100, 200, 100);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1, 0);
light3.position.set(-100, -200, -100);
scene.add(light3);

// guiScene(gui, scene);

const geometry = new THREE.TorusKnotGeometry(7, 1, 200, 32).toNonIndexed();

generateVertexColors(geometry);

let mesh;
const selectedMaterial = window.location.hash.substring(1) || 'MeshBasicMaterial';
if (selectedMaterial == 'Combine') {
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
    mesh.material = chooseFromHash(selectedMaterial, gui, mesh, geometry);
}


scene.add(mesh);

let prevFog = false;


function render() {
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.005;

    if (prevFog !== scene.fog) {
        // Trong trường hợp selectedMaterial bằng Combine thì mesh.material bằng undefined
        if (mesh.material) {
            mesh.material.needsUpdate = true;
        }
        prevFog = scene.fog;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


render();
