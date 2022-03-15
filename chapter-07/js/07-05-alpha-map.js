import {
    SphereGeometry,
    MeshStandardMaterial,
    DoubleSide,
    RepeatWrapping,
    Mesh,
    TextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights(false);
        this.loadTexture();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    loadTexture() {
        const textureLoader = new TextureLoader();
        const alphaTexture = textureLoader.load('../textures/partial-transparency.png');
        alphaTexture.wrapS = RepeatWrapping;
        alphaTexture.wrapT = RepeatWrapping;
        alphaTexture.repeat.set(8, 8);
        this.alphaMaps = {
            none: null,
            partial: alphaTexture
        };
        this.material = new MeshStandardMaterial({
            alphaMap: alphaTexture,
            roughness: 0.07,
            transparent: true,
            side: DoubleSide
        });
    }

    createMesh() {
        const geometry = new SphereGeometry(0.4);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const alphaMapKeys = this.getObjectsKeys(this.alphaMaps);
        const gui = new GUI();
        const controls = {
            alphaMap: alphaMapKeys[1]
        };
        gui.add(controls, 'alphaMap', alphaMapKeys)
            .onChange(this.updateTexture(this.material, 'alphaMap', this.alphaMaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
