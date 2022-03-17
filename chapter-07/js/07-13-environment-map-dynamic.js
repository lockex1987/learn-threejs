import {
    BoxGeometry,
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    Object3D,
    CubeTextureLoader,
    WebGLCubeRenderTarget,
    LinearMipmapLinearFilter,
    CubeCamera
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);
        this.createLights(false);
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

        this.scene.background = this.cubeTexture;
    }

    createMesh() {
        const sphereMaterial = new MeshStandardMaterial({
            color: 0xFFFFFF,
            envMap: this.cubeTexture
        });
        const sphereGeometry = new SphereGeometry(0.1, 32, 32);
        const sphereMesh = new Mesh(sphereGeometry, sphereMaterial);
        sphereMesh.position.x = 0.5;
        this.scene.add(sphereMesh);

        const cubeRenderTarget = new WebGLCubeRenderTarget(
            128,
            {
                generateMipmaps: true,
                minFilter: LinearMipmapLinearFilter
            }
        );
        this.cubeCamera = new CubeCamera(0.1, 100, cubeRenderTarget);
        // this.scene.add(this.cubeCamera);

        const cubeMaterial = new MeshStandardMaterial({
            color: 0xFFFFFF,
            roughness: 0,
            metalness: 0.5,
            envMap: cubeRenderTarget.texture
        });
        const cubeGeometry = new BoxGeometry(0.5, 0.5, 0.5);
        this.cubeMesh = new Mesh(cubeGeometry, cubeMaterial);
        this.cubeMesh.position.x = -0.5;
        this.scene.add(this.cubeMesh);

        this.cubeMesh.add(this.cubeCamera);

        this.cubeCamera.position.copy(this.cubeMesh.position);
        // this.cubeCamera.position.x = -2; // TODO: đang bị to quá

        // const pivot = new Object3D();
        // pivot.add(this.cubeMesh);
        // this.scene.add(pivot);
    }

    /**
     * Ghi đè phương thức này.
     */
    render(ms) {
        this.orbitControls.update();
        this.update(ms);

        this.cubeMesh.visible = false;
        this.cubeCamera.update(this.renderer, this.scene);
        this.cubeMesh.visible = true;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
