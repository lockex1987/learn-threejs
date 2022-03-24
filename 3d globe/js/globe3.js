import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    PointLight,
    AmbientLight,
    DirectionalLight,
    SpotLight,
    TextureLoader,
    SphereGeometry,
    MeshPhongMaterial,
    MeshBasicMaterial,
    MeshLambertMaterial,
    ShaderMaterial,
    Mesh,
    Object3D,
    BackSide,
    DoubleSide,
    AdditiveBlending,
    Vector3
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';


const canvas = document.querySelector('#webglOutput');

// Scene, Camera, Renderer
const scene = new Scene();


const aspect = window.innerWidth / window.innerHeight;
const camera = new PerspectiveCamera(45, aspect, 0.1, 1500);

const renderer = new WebGLRenderer({
    canvas
});

let cameraRotation = 0;
let cameraRotationSpeed = 0.001;
let cameraAutoRotation = true;

const orbitControls = new OrbitControls(camera, renderer.domElement);

// Lights
const spotLight = new SpotLight(0xffffff, 1, 0, 10, 2);

// Texture Loader
const textureLoader = new TextureLoader();

// Planet Proto
const planetProto = {
    sphere: function (size) {
        const sphere = new SphereGeometry(size, 32, 32);
        return sphere;
    },

    material: function (options) {
        const material = new MeshPhongMaterial();
        if (options) {
            for (const property in options) {
                material[property] = options[property];
            }
        }
        return material;
    },

    glowMaterial: function (intensity, fade, color) {
        // Custom glow shader from https://github.com/stemkoski/stemkoski.github.com/tree/master/Three.js
        const glowMaterial = new ShaderMaterial({
            uniforms: {
                c: {
                    type: 'f',
                    value: intensity
                },
                p: {
                    type: 'f',
                    value: fade
                },
                glowColor: {
                    type: 'c',
                    value: new Color(color)
                },
                viewVector: {
                    type: 'v3',
                    value: camera.position
                }
            },

            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;

                void main() {
                    vec3 vNormal = normalize( normalMatrix * normal );
                    vec3 vNormel = normalize( normalMatrix * viewVector );
                    intensity = pow( c - dot(vNormal, vNormel), p );
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,

            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;

                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4( glow, 1.0 );
                }`,

            side: BackSide,
            blending: AdditiveBlending,
            transparent: true
        });

        return glowMaterial;
    },

    texture: function (material, property, uri) {
        const textureLoader = new TextureLoader();
        textureLoader.crossOrigin = true;
        textureLoader.load(
            uri,
            function (texture) {
                material[property] = texture;
                material.needsUpdate = true;
            });
    }
};


const createPlanet = function (options) {
    // Create the planet's Surface
    const surfaceGeometry = planetProto.sphere(options.surface.size);
    const surfaceMaterial = planetProto.material(options.surface.material);
    const surface = new Mesh(surfaceGeometry, surfaceMaterial);

    // Create the planet's Atmosphere
    const atmosphereGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size);
    const atmosphereMaterialDefaults = {
        side: DoubleSide,
        transparent: true
    };

    const atmosphereMaterialOptions = Object.assign(atmosphereMaterialDefaults, options.atmosphere.material);
    const atmosphereMaterial = planetProto.material(atmosphereMaterialOptions);
    const atmosphere = new Mesh(atmosphereGeometry, atmosphereMaterial);

    // Create the planet's Atmospheric glow
    const atmosphericGlowGeometry = planetProto.sphere(options.surface.size + options.atmosphere.size + options.atmosphere.glow.size);
    const atmosphericGlowMaterial = planetProto.glowMaterial(options.atmosphere.glow.intensity, options.atmosphere.glow.fade, options.atmosphere.glow.color);
    const atmosphericGlow = new Mesh(atmosphericGlowGeometry, atmosphericGlowMaterial);

    // Nest the planet's Surface and Atmosphere into a planet object
    const planet = new Object3D();
    surface.name = 'surface';
    atmosphere.name = 'atmosphere';
    atmosphericGlow.name = 'atmosphericGlow';
    planet.add(surface);
    planet.add(atmosphere);
    planet.add(atmosphericGlow);

    // Load the Surface's textures
    for (const textureProperty in options.surface.textures) {
        planetProto.texture(
            surfaceMaterial,
            textureProperty,
            options.surface.textures[textureProperty]);
    }

    // Load the Atmosphere's texture
    for (const textureProperty in options.atmosphere.textures) {
        planetProto.texture(
            atmosphereMaterial,
            textureProperty,
            options.atmosphere.textures[textureProperty]);
    }

    return planet;
};

const earth = createPlanet({
    surface: {
        size: 0.5,
        material: {
            bumpScale: 0.05,
            specular: new Color('grey'),
            shininess: 10
        },

        textures: {
            map: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
            bumpMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg',
            specularMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg'
        }
    },

    atmosphere: {
        size: 0.003,
        material: { opacity: 0.8 },

        textures: {
            map: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg',
            alphaMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmaptrans.jpg'
        },

        glow: {
            size: 0.02,
            intensity: 0.7,
            fade: 7,
            color: 0x93cfef
        }
    }
});


// Marker Proto
const markerProto = {
    latLongToVector3: function latLongToVector3(latitude, longitude, radius, height) {
        const phi = latitude * Math.PI / 180;
        const theta = (longitude - 180) * Math.PI / 180;
        const x = -(radius + height) * Math.cos(phi) * Math.cos(theta);
        const y = (radius + height) * Math.sin(phi);
        const z = (radius + height) * Math.cos(phi) * Math.sin(theta);
        return new Vector3(x, y, z);
    },

    marker: function marker(size, color, vector3Position) {
        const markerGeometry = new SphereGeometry(size);
        const markerMaterial = new MeshLambertMaterial({ color: color });
        const markerMesh = new Mesh(markerGeometry, markerMaterial);
        markerMesh.position.copy(vector3Position);
        return markerMesh;
    }
};


// Place Marker
const placeMarker = function (object, options) {
    const position = markerProto.latLongToVector3(options.latitude, options.longitude, options.radius, options.height);
    const marker = markerProto.marker(options.size, options.color, position);
    object.add(marker);
};

// Place Marker At Address
const placeMarkerAtAddress = function (address, color) {
    const encodedLocation = address.replace(/\s/g, '+');
    const httpRequest = new XMLHttpRequest();

    httpRequest.open('GET', 'https://maps.googleapis.com/maps/api/geocode/json?address=' + encodedLocation);
    httpRequest.send(null);
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            const result = JSON.parse(httpRequest.responseText);

            if (result.results.length > 0) {
                const latitude = result.results[0].geometry.location.lat;
                const longitude = result.results[0].geometry.location.lng;

                placeMarker(earth.getObjectByName('surface'), {
                    latitude: latitude,
                    longitude: longitude,
                    radius: 0.5,
                    height: 0,
                    size: 0.01,
                    color: color
                });
            }
        }
    };
};

// Galaxy
const galaxyGeometry = new SphereGeometry(100, 32, 32);
const galaxyMaterial = new MeshBasicMaterial({
    side: BackSide
});

const galaxy = new Mesh(galaxyGeometry, galaxyMaterial);

// Load Galaxy Textures
textureLoader.crossOrigin = true;
textureLoader.load(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png',
    function (texture) {
        galaxyMaterial.map = texture;
        scene.add(galaxy);
    });


// Scene, Camera, Renderer Configuration
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(1, 1, 1);
orbitControls.enabled = !cameraAutoRotation;

scene.add(camera);
scene.add(spotLight);
scene.add(earth);

// Light Configurations
spotLight.position.set(2, 0, 1);

// Mesh Configurations
earth.receiveShadow = true;
earth.castShadow = true;
earth.getObjectByName('surface').geometry.center();

// On window resize, adjust camera aspect ratio and renderer size
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Main render function
const render = function () {
    earth.getObjectByName('surface').rotation.y += 1 / 32 * 0.01;
    earth.getObjectByName('atmosphere').rotation.y += 1 / 16 * 0.01;
    if (cameraAutoRotation) {
        cameraRotation += cameraRotationSpeed;
        camera.position.y = 0;
        camera.position.x = 2 * Math.sin(cameraRotation);
        camera.position.z = 2 * Math.cos(cameraRotation);
        camera.lookAt(earth.position);
    }
    requestAnimationFrame(render);
    renderer.render(scene, camera);
};

render();

// dat.gui
const gui = new GUI();
const guiCamera = gui.addFolder('Camera');
const guiSurface = gui.addFolder('Surface');
const guiMarkers = guiSurface.addFolder('Markers');
const guiAtmosphere = gui.addFolder('Atmosphere');
const guiAtmosphericGlow = guiAtmosphere.addFolder('Glow');

// dat.gui controls object
const cameraControls = new function () {
    this.speed = cameraRotationSpeed;
    this.orbitControls = !cameraAutoRotation;
}();

const surfaceControls = new function () {
    this.rotation = 0;
    this.bumpScale = 0.05;
    this.shininess = 10;
}();

const markersControls = new function () {
    this.address = '';
    this.color = 0xff0000;
    this.placeMarker = function () {
        placeMarkerAtAddress(this.address, this.color);
    };
}();

const atmosphereControls = new function () {
    this.opacity = 0.8;
}();

const atmosphericGlowControls = new function () {
    this.intensity = 0.7;
    this.fade = 7;
    this.color = 0x93cfef;
}();

// dat.gui controls
guiCamera.add(cameraControls, 'speed', 0, 0.1).step(0.001).onChange(function (value) {
    cameraRotationSpeed = value;
});
guiCamera.add(cameraControls, 'orbitControls').onChange(function (value) {
    cameraAutoRotation = !value;
    orbitControls.enabled = value;
});

guiSurface.add(surfaceControls, 'rotation', 0, 6).onChange(function (value) {
    earth.getObjectByName('surface').rotation.y = value;
});
guiSurface.add(surfaceControls, 'bumpScale', 0, 1).step(0.01).onChange(function (value) {
    earth.getObjectByName('surface').material.bumpScale = value;
});
guiSurface.add(surfaceControls, 'shininess', 0, 30).onChange(function (value) {
    earth.getObjectByName('surface').material.shininess = value;
});

guiMarkers.add(markersControls, 'address');
guiMarkers.addColor(markersControls, 'color');
guiMarkers.add(markersControls, 'placeMarker');

guiAtmosphere.add(atmosphereControls, 'opacity', 0, 1).onChange(function (value) {
    earth.getObjectByName('atmosphere').material.opacity = value;
});

guiAtmosphericGlow.add(atmosphericGlowControls, 'intensity', 0, 1).onChange(function (value) {
    earth.getObjectByName('atmosphericGlow').material.uniforms.c.value = value;
});
guiAtmosphericGlow.add(atmosphericGlowControls, 'fade', 0, 50).onChange(function (value) {
    earth.getObjectByName('atmosphericGlow').material.uniforms.p.value = value;
});
guiAtmosphericGlow.addColor(atmosphericGlowControls, 'color').onChange(function (value) {
    earth.getObjectByName('atmosphericGlow').material.uniforms.glowColor.value.setHex(value);
});
