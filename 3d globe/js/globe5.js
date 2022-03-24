// https://sitnik.ru/en/
// https://github.com/ai/sitnik.ru
// https://dev.to/evilmartians/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers-43he

import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    AmbientLight,
    DirectionalLight,
    SphereGeometry,
    MeshPhongMaterial,
    MeshBasicMaterial,
    SpriteMaterial,
    Mesh,
    TextureLoader,
    ImageLoader,
    CanvasTexture,
    Spherical,
    Vector3,
    Sprite
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import visited from './visited.js';


function setPosition(position, radius, latitude, longitude) {
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    position.x = -radius * Math.sin(phi) * Math.cos(theta);
    position.z = radius * Math.sin(phi) * Math.sin(theta);
    position.y = radius * Math.cos(phi);
}


function init() {
    const canvas = document.querySelector('#webglOutput');

    const RADIUS = 0.765 * 0.88;
    const PI2 = 2 * Math.PI;

    const scene = new Scene();
    scene.background = new Color(0xffffff);

    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const aspect = width / height;
    const camera = new PerspectiveCamera(45, aspect, 0.1, 100);

    const renderer = new WebGLRenderer({
        canvas,
        antialias: true
    });
    const pixelRatio = window.devicePixelRatio;
    // renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width * pixelRatio, height * pixelRatio, false);

    let canvasHeight = height;

    const loader = new ImageLoader();
    const delta = new Spherical();

    const textureLoader = new TextureLoader();
    const texture = textureLoader.load('../textures/globe5/map.png', () => {
        renderer.render(scene, camera);
    });
    texture.flipY = false;

    const globeGeometry = new SphereGeometry(RADIUS, 64, 64);
    const globeMaterial = new MeshPhongMaterial({
        map: texture
    });
    const sphere = new Mesh(globeGeometry, globeMaterial);
    scene.add(sphere);

    const here = new Sprite(new SpriteMaterial());
    here.material.depthTest = false;
    // here.material.depthTest = true;
    here.scale.set(0.1, 0.1, 1);
    here.center.set(0.5, 0);
    scene.add(here);

    visited.forEach(i => {
        const dot = new Mesh(
            new SphereGeometry(0.004, 8),
            new MeshBasicMaterial({
                color: new Color(0xffffff)
            })
        );
        setPosition(dot.position, RADIUS, i[0], i[1]);
        scene.add(dot);
    });

    // Light
    scene.add(new AmbientLight(0x909090));

    const light = new DirectionalLight(0x4f4f4f, 1);
    light.position.set(1, 0, 1);
    scene.add(light);


    function moveSun() {
        const now = new Date();
        const solstice = new Date(now.getFullYear() + '-06-21 00:00:00');
        const days = (now - solstice) / (1000 * 60 * 60 * 24);
        const sunLat = 23.44 * Math.cos((2 * Math.PI * days) / 365.26);
        const sunLong = 180 - 15 * (now.getUTCHours() + now.getMinutes() / 60);
        setPosition(light.position, 2, sunLat, sunLong);
    }

    // moveSun();
    // setInterval(moveSun, 30 * 60 * 1000);


    // TODO: Chuyển về TextureLoader
    const hereUrl = '../textures/globe5/here.png';
    loader.load(hereUrl, hereImage => {
        here.material.map = new CanvasTexture(hereImage);
        here.material.map.flipY = false;
        here.material.needsUpdate = true;
        renderer.render(scene, camera);
    });

    // Barcelona, Spain
    // const latitude = 41.3850639;
    // const longitude = 2.1734035;

    // Ba Đình, Vietnam
    const latitude = 21.0337815;
    const longitude = 105.8140539;

    setPosition(here.position, RADIUS, latitude, longitude);
    setPosition(camera.position, 2, latitude > 0 ? 20 : -20, longitude);
    camera.lookAt(0, 0, 0);

    const distanceToEdge = camera.position.distanceTo(new Vector3(0, RADIUS, 0));

    // const orbitControls = new OrbitControls(camera, renderer.domElement);

    function render() {
        // orbitControls.update();
        renderer.render(scene, camera);
        // requestAnimationFrame(render);
    }

    function resize() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvasHeight = height;

        const aspect = width / height;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        renderer.setSize(width * pixelRatio, height * pixelRatio, false);
        renderer.render(scene, camera);
    }

    function move1(start, end) {
        delta.setFromVector3(camera.position);

        delta.theta -= (PI2 * (end[0] - start[0])) / canvasHeight;
        delta.phi -= (PI2 * (end[1] - start[1])) / canvasHeight;

        delta.makeSafe();
        camera.position.setFromSpherical(delta);
        camera.lookAt(0, 0, 0);

        const distanceToHere = camera.position.distanceTo(here.position);
        here.material.depthTest = distanceToHere > distanceToEdge;

        renderer.render(scene, camera);
    }

    // requestAnimationFrame(render);

    window.addEventListener('resize', () => {
        resize();
    });

    let rotateStart;

    function move(x, y) {
        move1(rotateStart, [x, y]);
        rotateStart = [x, y];
    }

    function mouseMove(evt) {
        move(evt.clientX, evt.clientY);
    }

    function mouseUp() {
        document.body.classList.remove('is-grabbing');
        document.removeEventListener('mousemove', mouseMove, false);
        document.removeEventListener('mouseup', mouseUp, false);
    }

    canvas.addEventListener('mousedown', evt => {
        if (evt.button === 0) {
            // left
            rotateStart = [evt.clientX, evt.clientY];
            evt.preventDefault();
            document.addEventListener('mousemove', mouseMove, false);
            document.addEventListener('mouseup', mouseUp, false);
            document.body.classList.add('is-grabbing');
        }
    });

    if (window.innerWidth > 980) {
        canvas.addEventListener(
            'touchstart',
            evt => {
                if (evt.touches.length === 1) {
                    rotateStart = [evt.touches[0].pageX, evt.touches[0].pageY];
                }
            },
            { passive: true }
        );
        canvas.addEventListener(
            'touchmove',
            evt => {
                if (evt.touches.length === 1) {
                    move(evt.touches[0].pageX, evt.touches[0].pageY);
                }
            },
            { passive: true }
        );
    } else {
        canvas.addEventListener('touchstart',
            evt => {
                if (evt.touches.length === 1) {
                    evt.preventDefault();
                    rotateStart = [evt.touches[0].pageX, evt.touches[0].pageY];
                }
            }
        );
        canvas.addEventListener('touchmove',
            evt => {
                if (evt.touches.length === 1) {
                    evt.preventDefault();
                    move(evt.touches[0].pageX, evt.touches[0].pageY);
                }
            }
        );
    }
}


init();
