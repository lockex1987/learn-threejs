import {
    SphereGeometry,
    BoxGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    BackSide
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
        const textureLoader = new TextureLoader();

        const orders = [
            'pos-x',
            'neg-x',
            'pos-y',
            'neg-y',
            'pos-z',
            'neg-z'
        ];

        /*
        const orders = [
            'px',
            'nx',
            'py',
            'ny',
            'pz',
            'nz'
        ];
        */
        const materials = orders.map(fileName => new MeshStandardMaterial({
            map: textureLoader.load('../textures/cube/ho_chi_minh_city/' + fileName + '.jpg'),
            // map: textureLoader.load('../textures/cube/swedish_royal_castle/' + fileName + '.jpg'),
            side: BackSide
        }));
        const geometry = new BoxGeometry(5, 5, 5);
        const mesh = new Mesh(geometry, materials);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
