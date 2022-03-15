import {
    SphereGeometry,
    MeshStandardMaterial,
    Mesh,
    WebGLRenderer
} from 'https://unpkg.com/three@0.137.5/build/three.module.js';

import BaseExample from './base-example.js';


class ThreejsExample extends BaseExample {
    constructor(canvas) {
        super(canvas);

        this.scene.background = null; // phải bỏ background

        // this.renderer.alpha = true; // không sửa được, phải thiết lập khi khởi tạo
        this.createRendererWithAlpha(canvas);

        this.createLights(false);
        this.createMesh();
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

    createRendererWithAlpha(canvas) {
        this.renderer = new WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        const pixelRatio = window.devicePixelRatio;
        this.renderer.setSize(canvas.clientWidth * pixelRatio, canvas.clientHeight * pixelRatio, false);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
