import {
    BoxGeometry,
    SphereGeometry,
    MeshStandardMaterial,
    MeshPhongMaterial,
    Mesh,
    CubeTextureLoader,
    CubeRefractionMapping,
    CubeReflectionMapping
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights(false);
        this.createSkybox();
        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
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
        // this.cubeTexture.mapping = CubeRefractionMapping;

        // this.scene.background.mapping = CubeRefractionMapping;

        const refractionCube = cubeTextureLoader.load(images);
        refractionCube.mapping = CubeRefractionMapping;

        this.envMaps = {
            none: null,
            reflection: this.cubeTexture,
            refraction: refractionCube
        };

        this.scene.background = this.cubeTexture;

        // MeshStandardMaterial không chạy được, do xung đột với metalness?
        this.material = new MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0,
            metalness: 1,
            // envMap: this.envMaps.reflection
            envMap: this.cubeTexture,
            refractionRatio: 0.98,
            // reflectivity: 0.9
        });
    }

    createMesh() {
        // const geometry = new SphereGeometry(0.4);
        const geometry = new BoxGeometry(0.5, 0.5, 0.5);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const envMapKeys = this.getObjectsKeys(this.envMaps);
        const gui = new GUI();
        const data = {
            envMap: envMapKeys[1]
        };
        gui.add(data, 'envMap', envMapKeys)
            .onChange(this.updateTexture(this.material, 'envMap', this.envMaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
