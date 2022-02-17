class Example1 {
    constructor() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            75, // fov
            window.innerWidth / window.innerHeight, // aspect ratio
            0.1, // near
            1000 // far
        );
        this.camera.position.z = 5;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.mesh = null;

        this.init();
        this.animate();
    }

    init() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({
            color: 0x00ff00
        });
        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
    }

    update() {
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.01;
    }

    animate() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }
}


new Example1();
