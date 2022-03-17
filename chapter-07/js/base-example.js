import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Color,
    AmbientLight,
    PointLight,
    SphereGeometry,
    MeshStandardMaterial,
    Mesh
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


class BaseExample {
    constructor(canvas) {
        this.createScene();
        this.createCamera(canvas);
        this.createRenderer(canvas);
        this.createOrbitControls();
        this.handleResize();
    }

    createScene() {
        this.scene = new Scene();
        this.scene.background = new Color(0xFFFFFF);
    }

    createCamera(canvas) {
        const aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera = new PerspectiveCamera(45, aspect, 0.1, 150);
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

    createLights(movePointLight = true) {
        this.ambientLight = new AmbientLight(0xFFFFFF, 0.3);
        this.scene.add(this.ambientLight);

        let sphereLightMesh;
        if (movePointLight) {
            const sphereLightGeometry = new SphereGeometry(0.005);
            const sphereLightMaterial = new MeshStandardMaterial({
                color: 0xff0000,
                emissive: 0xff0000
            });
            sphereLightMesh = new Mesh(sphereLightGeometry, sphereLightMaterial);
            this.scene.add(sphereLightMesh);
        }

        this.pointLight = new PointLight(0xffffff, 0.5);
        this.pointLight.position.set(0, 0.05, 0.6);
        this.pointLight.tick = ms => {
            if (movePointLight) {
                const angle = (ms / 1000) * Math.PI * 0.2;
                const radius = 0.6;
                this.pointLight.position.x = Math.sin(angle) * radius;
                this.pointLight.position.z = Math.cos(angle) * radius;
                sphereLightMesh.position.copy(this.pointLight.position);
            }
        };
        this.scene.add(this.pointLight);
    }

    createOrbitControls() {
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControls.enableDamping = true;
    }

    update(ms) {
        if (this.pointLight) {
            this.pointLight.tick(ms);
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

    getObjectsKeys(obj) {
        return Object.keys(obj);
    }

    updateTexture(material, materialKey, textures) {
        return key => {
            material[materialKey] = textures[key];
            material.needsUpdate = true;
        };
    }
}


export default BaseExample;
