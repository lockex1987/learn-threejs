import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    CubeTextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights();
        this.createSkybox();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
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
        this.cubeTexture = cubeTextureLoader.load(images);

        const textureLoader = new TextureLoader();
        const roughnessTexture = textureLoader.load('../textures/roughness_map.jpg');

        this.scene.background = this.cubeTexture;

        this.material = new MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 1, // giá trị này sẽ được nhân vào với từng điểm ở map
            roughnessMap: roughnessTexture,
            metalness: 1,
            envMap: this.cubeTexture
        });
    }

    createMesh() {
        const geometry = new SphereGeometry(0.4);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
