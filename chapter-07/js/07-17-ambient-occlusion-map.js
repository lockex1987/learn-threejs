import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights(false);
        this.ambientLight.intensity = 1;
        this.scene.remove(this.pointLight);
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    createMesh() {
        const textureLoader = new TextureLoader();
        const colorTexture = textureLoader.load('../textures/blocks/blocks_color.jpg');
        const ambientOcclusionTexture = textureLoader.load('../textures/blocks/blocks_ambient_occlusion.jpg');

        const geometry = new SphereGeometry(0.4);
        geometry.attributes.uv2 = geometry.attributes.uv; // phải thêm cái này

        this.material = new MeshStandardMaterial({
            map: colorTexture,
            aoMap: ambientOcclusionTexture, // khó phân biệt sự khác nhau
            aoMapIntensity: 0.5
        });
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);

        this.aoMaps = {
            none: null,
            shadow: ambientOcclusionTexture
        };
    }

    createControlsGui() {
        const aoMapKeys = this.getObjectsKeys(this.aoMaps);
        const gui = new GUI();
        const controls = {
            aoMap: aoMapKeys[1]
        };
        gui.add(controls, 'aoMap', aoMapKeys)
            .onChange(this.updateTexture(this.material, 'aoMap', this.aoMaps));
        gui.add(this.material, 'aoMapIntensity', 0, 5);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
