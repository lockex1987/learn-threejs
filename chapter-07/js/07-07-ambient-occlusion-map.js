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
        const normalTexture = textureLoader.load('../textures/blocks/blocks_normal.jpg');
        const ambientOcclusionTexture = textureLoader.load('../textures/blocks/blocks_ambient_occlusion.jpg');

        const geometry = new SphereGeometry(0.4, 80, 80);
        const material = new MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture,
            aoMap: ambientOcclusionTexture, // khó phân biệt sự khác nhau
            roughness: 0.07
        });
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
