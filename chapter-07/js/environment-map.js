import {
    BoxGeometry,
    MeshStandardMaterial,
    Mesh,
    TextureLoader,
    CubeTextureLoader,
    CubeRefractionMapping,
    RepeatWrapping
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.16/+esm';
import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights();

        this.loadTexture();

        this.material = new MeshStandardMaterial({
            // map: this.colorMaps.bricks,
            envMap: this.envMaps.reflection,
            roughness: 0
        });

        this.createMesh();
        requestAnimationFrame(this.render.bind(this));
        this.createControlsGui();
    }

    loadTexture() {
        const textureLoader = new TextureLoader();
        const cubeTextureLoader = new CubeTextureLoader();

        this.envMaps = (() => {
            const path = '../textures/cube/swedish_royal_castle/';
            const format = '.jpg';
            const urls = [
                path + 'px' + format,
                path + 'nx' + format,
                path + 'py' + format,
                path + 'ny' + format,
                path + 'pz' + format,
                path + 'nz' + format
            ];
            const reflectionCube = cubeTextureLoader.load(urls);
            const refractionCube = cubeTextureLoader.load(urls);
            refractionCube.mapping = CubeRefractionMapping;
            return {
                none: null,
                reflection: reflectionCube,
                refraction: refractionCube
            };
        })();

        this.colorMaps = (() => {
            const bricks = textureLoader.load('../textures/blocks/blocks_color.jpg');
            bricks.wrapS = RepeatWrapping;
            bricks.wrapT = RepeatWrapping;
            bricks.repeat.set(9, 1);
            return {
                none: null,
                bricks: bricks
            };
        })();

        this.roughnessMaps = (() => {
            const bricks = textureLoader.load('../textures/blocks/blocks_roughness.jpg');
            bricks.wrapT = RepeatWrapping;
            bricks.wrapS = RepeatWrapping;
            bricks.repeat.set(9, 1);
            return {
                none: null,
                bricks: bricks
            };
        })();

        this.alphaMaps = (() => {
            const fibers = textureLoader.load('../textures/blocks/blocks_bump.jpg');
            fibers.wrapT = RepeatWrapping;
            fibers.wrapS = RepeatWrapping;
            fibers.repeat.set(9, 1);
            return {
                none: null,
                fibers: fibers
            };
        })();
    }

    createMesh() {
        const geometry = new BoxGeometry(0.5, 0.5, 0.5);
        const mesh = new Mesh(geometry, this.material);
        this.scene.add(mesh);
    }

    createControlsGui() {
        const envMapKeys = this.getObjectsKeys(this.envMaps);
        const colorMapKeys = this.getObjectsKeys(this.colorMaps);
        const roughnessMapKeys = this.getObjectsKeys(this.roughnessMaps);
        const alphaMapKeys = this.getObjectsKeys(this.alphaMaps);

        const gui = new GUI();
        const data = {
            map: colorMapKeys[0],
            envMap: envMapKeys[1],
            alphaMap: alphaMapKeys[0],
            roughnessMap: roughnessMapKeys[0]
        };
        gui.add(data, 'map', colorMapKeys).onChange(this.updateTexture(this.material, 'map', this.colorMaps));
        gui.add(data, 'envMap', envMapKeys).onChange(this.updateTexture(this.material, 'envMap', this.envMaps));
        gui.add(data, 'alphaMap', alphaMapKeys).onChange(this.updateTexture(this.material, 'alphaMap', this.alphaMaps));
        gui.add(data, 'roughnessMap', roughnessMapKeys).onChange(this.updateTexture(this.material, 'roughnessMap', this.roughnessMaps));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
