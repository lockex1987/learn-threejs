import {
    SphereGeometry,
    MeshBasicMaterial,
    MeshStandardMaterial,
    Mesh,
    TextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import { GUI } from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/lil-gui.module.min.js';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.controls = {
            type: 'map'
        };
        this.createLights();
        this.createMesh();
        this.createControlsGui();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const textureLoader = new TextureLoader();
        const colorTexture = textureLoader.load('../textures/blocks/blocks-color.jpg');
        const bumpTexture = textureLoader.load('../textures/blocks/blocks-bump.jpg');
        const normalTexture = textureLoader.load('../textures/blocks/blocks-normal.jpg');
        const roughnessTexture = textureLoader.load('../textures/blocks/blocks-roughness.jpg');
        const displacementTexture = textureLoader.load('../textures/blocks/blocks-displacement.png');

        const geometry = new SphereGeometry(0.4);
        // const geometry = new SphereGeometry( 15, 32, 16 );
        const material = new MeshStandardMaterial({
            // color: 0x156289,
            // emissive: 0x072534,
            // roughness: 0
            map: colorTexture,
            // bumpMap: bumpTexture
            normalMap: normalTexture,
            roughnessMap: roughnessTexture,
            // displacementMap: displacementTexture
        });
        this.mesh = new Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    createControlsGui() {
        const gui = new GUI();
        const types = [
            'logo',
            'map'
        ];
        gui.add(this.controls, 'type', types)
            .onChange(() => {
                this.createMesh();
            });
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
