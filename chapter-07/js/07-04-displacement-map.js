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
        const colorTexture = textureLoader.load('../textures/sands/sands_color.jpg');
        const displacementTexture = textureLoader.load('../textures/sands/sands_displacement.png');
        this.displacementMaps = {
            none: null,
            sands: displacementTexture
        };
        this.material = new MeshStandardMaterial({
            map: colorTexture,
            displacementMap: displacementTexture,
            displacementScale: 0.1,
            roughness: 0.07
        });
    }

    createMesh() {
        // Phải tăng số polygon nên không bị xấu ở 2 cực
        const geometry = new SphereGeometry(0.4, 180, 180);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const displacementMapKeys = this.getObjectsKeys(this.displacementMaps);
        const gui = new GUI();
        const controls = {
            displacementMap: displacementMapKeys[1]
        };
        gui.add(controls, 'displacementMap', displacementMapKeys)
            .onChange(this.updateTexture(this.material, 'displacementMap', this.displacementMaps));
        gui.add(this.material, 'displacementScale', -0.5, 0.5);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
