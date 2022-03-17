import {
    BoxGeometry,
    PlaneGeometry,
    MeshNormalMaterial,
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

        this.camera.position.set(-40, 40, 40);
        this.camera.lookAt(this.scene.position);

        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
    }

    createMesh() {
        const groundGeometry = new PlaneGeometry(95, 95, 1, 1);
        groundGeometry.attributes.uv2 = groundGeometry.attributes.uv; // phải thêm cái này

        const textureLoader = new TextureLoader();
        const lightMapTexture = textureLoader.load('../textures/light_map.png');
        const groundMaterial = new MeshStandardMaterial({
            color: 0x777777,
            lightMap: lightMapTexture
        });

        const groundMesh = new Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        groundMesh.position.y = -5;
        this.scene.add(groundMesh);

        const cubeGeometry1 = new BoxGeometry(11, 11, 11);
        const cubeGeometry2 = new BoxGeometry(5, 5, 5);
        const meshMaterial = new MeshNormalMaterial();

        const cube1 = new Mesh(cubeGeometry1, meshMaterial);
        const cube2 = new Mesh(cubeGeometry2, meshMaterial);
        cube1.position.set(0, 0, 0);
        cube2.position.set(-16.5, 2, 4);
        this.scene.add(cube1);
        this.scene.add(cube2);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
