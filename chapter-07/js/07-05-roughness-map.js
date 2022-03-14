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
        const roughnessTexture = textureLoader.load('../textures/blocks/blocks_roughness.jpg');

        const geometry = new SphereGeometry(0.4, 180, 180);
        const material = new MeshStandardMaterial({
            map: colorTexture,
            normalMap: normalTexture,
            roughnessMap: roughnessTexture,
            roughness: 0.07 // giá trị này sẽ được nhân vào với từng điểm ở map
        });
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
