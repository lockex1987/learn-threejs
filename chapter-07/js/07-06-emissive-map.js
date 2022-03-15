import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    Color,
    Vector2
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights();

        // Giảm độ sáng
        this.scene.background = new Color(0x444444);
        // this.pointLight.intensity = 0.4;
        this.scene.remove(this.ambientLight);

        this.loadTexture();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    loadTexture() {
        const textureLoader = new TextureLoader();
        const emissiveTexture = textureLoader.load('../textures/lava/lava_emissive.png');
        this.emissiveMaps = {
            none: null,
            lava: emissiveTexture
        };
        this.material = new MeshStandardMaterial({
            emissiveMap: emissiveTexture,
            emissive: 0xFFFFFF,
            roughness: 0.07,
            normalMap: textureLoader.load('../textures/lava/lava_normal.png'),
            normalScale: new Vector2(4, 4)
            // metalnessMap: textureLoader.load('../textures/lava/lava_metalness.png')
        });
    }

    createMesh() {
        const geometry = new SphereGeometry(0.4);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const emissiveMapKeys = this.getObjectsKeys(this.emissiveMaps);
        const gui = new GUI();
        const controls = {
            emissiveMap: emissiveMapKeys[1]
        };
        gui.add(controls, 'emissiveMap', emissiveMapKeys)
            .onChange(this.updateTexture(this.material, 'emissiveMap', this.emissiveMaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
