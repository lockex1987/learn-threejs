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
        this.createLights();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const textureLoader = new TextureLoader();
        const colorTexture = textureLoader.load('../textures/blocks/blocks_color.jpg');
        const bumpTexture = textureLoader.load('../textures/blocks/blocks_bump.jpg');
        const geometry = new SphereGeometry(0.4);
        // const geometry = new SphereGeometry(0.4, 180, 180);
        const material = new MeshStandardMaterial({
            map: colorTexture,
            bumpMap: bumpTexture,
            // bumpScale: 1,
            // roughness: 0.07
        });
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
