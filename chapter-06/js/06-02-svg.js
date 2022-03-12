import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    HemisphereLight,
    PointLight,
    DirectionalLight,
    ExtrudeGeometry,
    MeshStandardMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/lil-gui.module.min.js';
import { SVGLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/SVGLoader.js';
import { mergeBufferGeometries } from 'https://unpkg.com/three@0.137.5/examples/jsm/utils/BufferGeometryUtils.js';
import transformSVGPath from '../../js/d3-threeD.js';


class ThreejsExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createLights();

        this.controls = {
            type: 'map'
        };
        this.createSvg();

        this.createOrbitControls();
        this.createControlsGui();
        this.handleResize();
        requestAnimationFrame(this.render.bind(this));
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0xFFFFFF);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 25);
        this.camera.position.z = 2;
    }

    createRenderer(canvas) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true
        });
        const pixelRatio = window.devicePixelRatio;
        this.renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
    }

    createLights() {
        const hemisphereLight = new HemisphereLight(0xffffff, 0xaaaaaa, 0.5);
        this.scene.add(hemisphereLight);

        const directionalLight = new DirectionalLight(0xeeeeee, 0.5);
        directionalLight.position.set(0, 2, 5);
        this.scene.add(directionalLight);

        const pointLight = new PointLight(0xffffff, 0.5);
        pointLight.position.set(0, 0.05, 2);
        this.scene.add(pointLight);
    }

    createSvg() {
        if (this.svgMesh) {
            this.scene.remove(this.svgMesh);
        }
        if (this.controls.type == 'logo') {
            this.createSvg1();
        } else if (this.controls.type == 'map') {
            this.createSvg2();
        }
    }

    createSvg1() {
        const svgString = document.querySelector('#batman-path').getAttribute('d');
        const geometry = this.createGeometryFromSvgString(svgString);
        this.createMesh(geometry);
    }

    createSvg2() {
        // const svgUrl = '../images/batman_logo.svg';
        const svgUrl = '../images/vietnamese_map.svg';
        const svgLoader = new SVGLoader();
        svgLoader.load(svgUrl, svg => {
            const geometry = this.createGeometryFromSvgObject(svg);
            geometry.rotateX(Math.PI);
            this.createMesh(geometry);
        });
    }

    createGeometryFromSvgString(svgString) {
        const arr = [];
        const path = transformSVGPath(svgString);
        const shapes = path.toShapes(true);
        shapes.forEach(shape => {
            const options = {
                depth: 2,
                bevelThickness: 2,
                bevelSize: 0.5,
                bevelSegments: 3,
                bevelEnabled: true,
                curveSegments: 12,
                steps: 1
            };
            const piece = new ExtrudeGeometry(shape, options);
            arr.push(piece);
        });
        const geometry = mergeBufferGeometries(arr, true);
        return geometry;
    }

    createGeometryFromSvgObject(svg) {
        const arr = [];
        const paths = svg.paths;
        paths.forEach(path => {
            const shapes = SVGLoader.createShapes(path);
            shapes.forEach(shape => {
                const options = {
                    depth: 2,
                    bevelThickness: 2,
                    bevelSize: 0.5,
                    bevelSegments: 3,
                    bevelEnabled: true,
                    curveSegments: 12,
                    steps: 1
                };
                const piece = new ExtrudeGeometry(shape, options);
                arr.push(piece);
            });
        });
        const geometry = mergeBufferGeometries(arr, true);
        return geometry;
    }

    createMesh(geometry) {
        const scale = 0.002;
        const svgMaterial = new MeshStandardMaterial({
            color: 0x156289,
            emissive: 0x072534,
            roughness: 0
        });

        geometry.center();
        geometry.scale(scale, scale, scale);

        this.svgMesh = new Mesh(geometry, svgMaterial);
        this.svgMesh.tick = ms => {
            // this.svgMesh.rotation.y = (ms / 1000) * Math.PI * 0.05;
        };
        this.scene.add(this.svgMesh);
    }

    createOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
    }

    createControlsGui() {
        const gui = new GUI();
        const types = [
            'logo',
            'map'
        ];
        gui.add(this.controls, 'type', types)
            .onChange(() => {
                this.createSvg();
            });
    }

    update(ms) {
        if (this.svgMesh) {
            this.svgMesh.tick(ms);
        }
    }

    render(ms) {
        this.orbitControls.update();
        this.update(ms);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.onResize();
        });
    }

    onResize() {
        const canvas = this.renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
