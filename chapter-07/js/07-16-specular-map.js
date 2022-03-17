import {
    SphereGeometry,
    MeshPhongMaterial,
    Mesh,
    TextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights(false);
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const textureLoader = new TextureLoader();
        // Phải dùng MeshPhongMaterial, không dùng MeshStandard (không có thuộc tính specularMap)
        const material = new MeshPhongMaterial({
            map: textureLoader.load('../textures/earth/earth_normal.png'),
            // map: textureLoader.load('../textures/earth/earth_color.png'),
            specularMap: textureLoader.load('../textures/earth/earth_specular.png'),
            // Tăng shininess để nhìn cho rõ điểm sáng
            shininess: 200
        });
        const geometry = new SphereGeometry(0.4, 50, 50);
        const mesh = new Mesh(geometry, material);
        this.scene.add(mesh);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
