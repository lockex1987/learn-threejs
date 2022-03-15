import {
    SphereGeometry,
    MeshStandardMaterial,
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
        const colorTexture = textureLoader.load('../textures/blocks/blocks_color.jpg');
        this.colorMaps = {
            none: null,
            blocks: colorTexture
        };
        this.material = new MeshStandardMaterial({
            map: colorTexture,
            roughness: 0.07
        });
    }

    createMesh() {
        const geometry = new SphereGeometry(0.4);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const colorMapKeys = this.getObjectsKeys(this.colorMaps);
        const gui = new GUI();
        const controls = {
            map: colorMapKeys[1]
        };
        gui.add(controls, 'map', colorMapKeys)
            .onChange(this.updateTexture(this.material, 'map', this.colorMaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
