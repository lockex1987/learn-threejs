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
        this.createLights();
        this.loadTexture();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    loadTexture() {
        const textureLoader = new TextureLoader();
        const colorTexture = textureLoader.load('../textures/blocks/blocks_color.jpg');
        const normalTexture = textureLoader.load('../textures/blocks/blocks_normal.jpg');
        this.normalMaps = {
            none: null,
            blocks: normalTexture
        };
        this.material = new MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture,
            roughness: 0.07
        });
    }

    createMesh() {
        const geometry = new SphereGeometry(0.4);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const normalMapKeys = this.getObjectsKeys(this.normalMaps);
        const gui = new GUI();
        const controls = {
            normalMap: normalMapKeys[1],
            normalScaleX: 1,
            normalScaleY: 1
        };
        gui.add(controls, 'normalMap', normalMapKeys)
            .onChange(this.updateTexture(this.material, 'normalMap', this.normalMaps));
        gui.add(controls, 'normalScaleX', -3, 3)
            .onChange(value => {
                this.material.normalScale.set(controls.normalScaleX, controls.normalScaleY);
            });
        gui.add(controls, 'normalScaleY', -3, 3)
            .onChange(value => {
                this.material.normalScale.set(controls.normalScaleX, controls.normalScaleY);
            });
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
