import {
    TorusKnotGeometry,
    MeshMatcapMaterial,
    Mesh,
    TextureLoader
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);

        const textureLoader = new TextureLoader();
        this.matcaps = {
            none: null,
            porcelainWhite: textureLoader.load('../textures/matcaps/porcelain_white.jpg')
        };
        this.material = new MeshMatcapMaterial({
            matcap: this.matcaps.porcelainWhite
        });

        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    createMesh() {
        const geometry = new TorusKnotGeometry(0.2, 0.03, 50, 8);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const matcapKeys = this.getObjectsKeys(this.matcaps);
        const gui = new GUI();
        const data = {
            matcap: matcapKeys[1]
        };
        gui.add(data, 'matcap', matcapKeys)
            .onChange(this.updateTexture(this.material, 'matcap', this.matcaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
