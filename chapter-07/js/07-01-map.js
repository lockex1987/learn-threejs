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
        this.createMesh();
        this.createControlsGui();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const textureLoader = new TextureLoader();
        const texture = textureLoader.load('../textures/ground/grasslight-big.jpg');

        const geometry = new SphereGeometry(0.2);
        // const geometry = new SphereGeometry( 15, 32, 16 );
        const material = new MeshBasicMaterial({
            color: 0xffff00,
            map: texture
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
