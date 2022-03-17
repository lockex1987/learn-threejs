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
        this.loadTexture();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    loadTexture() {
        const textureLoader = new TextureLoader();
        this.matcaps = {
            none: null,
            porcelainWhite: textureLoader.load('../textures/matcaps/porcelain_white.jpg')
        };
        for (let i = 1; i <= 8; i++) {
            this.matcaps[i] = textureLoader.load('../textures/matcaps/' + i + '.png');
        }
        this.material = new MeshMatcapMaterial({
            matcap: this.matcaps.porcelainWhite
        });
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
            matcap: 'porcelainWhite'
        };
        gui.add(data, 'matcap', matcapKeys)
            .onChange(this.updateTexture(this.material, 'matcap', this.matcaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
