import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    CubeTextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights(false);
        this.createMesh();
        this.createSkybox();
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

    createSkybox() {
        const orders = [
            'pos-x',
            'neg-x',
            'pos-y',
            'neg-y',
            'pos-z',
            'neg-z'
        ];
        const images = orders.map(fileName => {
            return '../textures/cube/computer_history_museum/' + fileName + '.jpg';
        });

        const cubeTextureLoader = new CubeTextureLoader();
        const cubeTexture = cubeTextureLoader.load(images); // .setPath('')
        this.scene.background = cubeTexture;
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
