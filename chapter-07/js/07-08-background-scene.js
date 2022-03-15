import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);

        const textureLoader = new TextureLoader();
        const backgroundTexture = textureLoader.load('../images/ha_noi.jpg');
        this.scene.background = backgroundTexture;

        this.createLights(false);
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const material = new MeshStandardMaterial({
            color: 0x156289,
            emissive: 0x072534,
            roughness: 0.07
        });
        const geometry = new SphereGeometry(0.4);
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
