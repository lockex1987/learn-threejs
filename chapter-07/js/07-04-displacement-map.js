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
        const colorTexture = textureLoader.load('../textures/sands/sands_color.jpg');
        const displacementTexture = textureLoader.load('../textures/sands/sands_displacement.png');

        const geometry = new SphereGeometry(0.4, 180, 180); // phải tăng số polygon nên không bị xấu ở 2 cực
        const material = new MeshStandardMaterial({
            map: colorTexture,
            displacementMap: displacementTexture,
            displacementScale: 0.1,
            roughness: 0.07
        });
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
