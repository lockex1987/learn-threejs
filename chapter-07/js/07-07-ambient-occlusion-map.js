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
        this.createLights(false);
        this.ambientLight.intensity = 1;
        this.scene.remove(this.pointLight);
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const textureLoader = new TextureLoader();
        const colorTexture = textureLoader.load('../textures/blocks/blocks_color.jpg');
        const ambientOcclusionTexture = textureLoader.load('../textures/blocks/blocks_ambient_occlusion.jpg');

        const geometry = new SphereGeometry(0.4);
        const material = new MeshStandardMaterial({
            map: colorTexture,
            aoMap: ambientOcclusionTexture // khó phân biệt sự khác nhau
        });
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
