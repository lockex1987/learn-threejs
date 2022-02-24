import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.137.5/examples/jsm/loaders/FontLoader.js';
import { ParametricGeometry } from 'https://unpkg.com/three@0.137.5/examples/jsm/geometries/ParametricGeometry.js';
import { TextGeometry } from 'https://unpkg.com/three@0.137.5/examples/jsm/geometries/TextGeometry.js';


/**
 * Promisify font loading.
 */
function loadFont(loader, url) {
    return new Promise((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
    });
}


class ThreejsExample {
    constructor(canvas) {
        this.scene = this.createScene();
        this.camera = this.createCamera();
        this.renderer = this.createRenderer(canvas);

        this.addLights();

        this.objects = [];
        this.spread = 15;
        this.addGeometries();

        requestAnimationFrame(this.render.bind(this));
    }

    createScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xAAAAAA);
        return scene;
    }

    createCamera(canvas) {
        const fov = 45;
        const aspect = 2; // the canvas default
        const near = 0.1;
        const far = 1000;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 120;
        return camera;
    }

    createRenderer(canvas) {
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true
        });
        return renderer;
    }

    addLights() {
        const color = 0xFFFFFF;
        const intensity = 1;

        const directionalLight1 = new THREE.DirectionalLight(color, intensity);
        directionalLight1.position.set(-1, 2, 4);
        this.scene.add(directionalLight1);

        const directionalLight2 = new THREE.DirectionalLight(color, intensity);
        directionalLight2.position.set(1, -2, -4);
        this.scene.add(directionalLight2);
    }

    addObject(x, y, obj) {
        obj.position.x = x * this.spread;
        obj.position.y = y * this.spread;
        this.scene.add(obj);
        this.objects.push(obj);
    }

    createSolidMaterial() {
        const material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide
        });

        const hue = Math.random();
        const saturation = 1;
        const luminance = 0.5;
        material.color.setHSL(hue, saturation, luminance);

        return material;
    }

    addSolidGeometry(x, y, geometry) {
        const material = this.createSolidMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        this.addObject(x, y, mesh);
    }

    addLineGeometry(x, y, geometry) {
        const material = new THREE.LineBasicMaterial({
            color: 0x000000
        });
        const mesh = new THREE.LineSegments(geometry, material);
        this.addObject(x, y, mesh);
    }

    resizeRendererToDisplaySize() {
        const canvas = this.renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            const pixelRatio = window.devicePixelRatio;
            this.renderer.setSize(width * pixelRatio, height * pixelRatio, false);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    render(time) {
        time *= 0.001;

        this.resizeRendererToDisplaySize();

        this.objects.forEach((obj, ndx) => {
            const speed = 0.1 + ndx * 0.05;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render.bind(this));
    }

    addGeometries() {
        {
            const width = 8;
            const height = 8;
            const depth = 8;
            this.addSolidGeometry(-2, 2, new THREE.BoxGeometry(width, height, depth));
        }

        {
            const radius = 7;
            const segments = 24;
            this.addSolidGeometry(-1, 2, new THREE.CircleGeometry(radius, segments));
        }

        {
            const radius = 6;
            const height = 8;
            const segments = 16;
            this.addSolidGeometry(0, 2, new THREE.ConeGeometry(radius, height, segments));
        }

        {
            const radiusTop = 4;
            const radiusBottom = 4;
            const height = 8;
            const radialSegments = 12;
            this.addSolidGeometry(1, 2, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments));
        }

        {
            const radius = 7;
            this.addSolidGeometry(2, 2, new THREE.DodecahedronGeometry(radius));
        }

        {
            const shape = new THREE.Shape();
            const x = -2.5;
            const y = -5;
            shape.moveTo(x + 2.5, y + 2.5);
            shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
            shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
            shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
            shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
            shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
            shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

            const extrudeSettings = {
                steps: 2,
                depth: 2,
                bevelEnabled: true,
                bevelThickness: 1,
                bevelSize: 1,
                bevelSegments: 2
            };
            this.addSolidGeometry(-2, 1, new THREE.ExtrudeGeometry(shape, extrudeSettings));
        }

        {
            const radius = 7;
            this.addSolidGeometry(-1, 1, new THREE.IcosahedronGeometry(radius));
        }

        {
            const points = [];
            for (let i = 0; i < 10; ++i) {
                points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * 0.8));
            }
            this.addSolidGeometry(0, 1, new THREE.LatheGeometry(points));
        }

        {
            const radius = 7;
            this.addSolidGeometry(1, 1, new THREE.OctahedronGeometry(radius));
        }

        {
            /*
            from: https://github.com/mrdoob/three.js/blob/b8d8a8625465bd634aa68e5846354d69f34d2ff5/examples/js/ParametricGeometries.js
            */
            function klein(v, u, target) {
                u *= Math.PI;
                v *= 2 * Math.PI;
                u = u * 2;

                let x;
                let z;

                if (u < Math.PI) {
                    x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
                    z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
                } else {
                    x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
                    z = -8 * Math.sin(u);
                }

                const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

                target.set(x, y, z).multiplyScalar(0.75);
            }

            const slices = 25;
            const stacks = 25;
            this.addSolidGeometry(2, 1, new ParametricGeometry(klein, slices, stacks));
        }

        {
            const width = 9;
            const height = 9;
            const widthSegments = 2;
            const heightSegments = 2;
            this.addSolidGeometry(-2, 0, new THREE.PlaneGeometry(width, height, widthSegments, heightSegments));
        }

        {
            const verticesOfCube = [
                -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
                -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1
            ];
            const indicesOfFaces = [
                2, 1, 0, 0, 3, 2,
                0, 4, 7, 7, 3, 0,
                0, 1, 5, 5, 4, 0,
                1, 2, 6, 6, 5, 1,
                2, 3, 7, 7, 6, 2,
                4, 5, 6, 6, 7, 4
            ];
            const radius = 7;
            const detail = 2;
            this.addSolidGeometry(-1, 0, new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail));
        }

        {
            const innerRadius = 2;
            const outerRadius = 7;
            const segments = 18;
            this.addSolidGeometry(0, 0, new THREE.RingGeometry(innerRadius, outerRadius, segments));
        }

        {
            const shape = new THREE.Shape();
            const x = -2.5;
            const y = -5;
            shape.moveTo(x + 2.5, y + 2.5);
            shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
            shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
            shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
            shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
            shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
            shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
            this.addSolidGeometry(1, 0, new THREE.ShapeGeometry(shape));
        }

        {
            const radius = 7;
            const widthSegments = 12;
            const heightSegments = 8;
            this.addSolidGeometry(2, 0, new THREE.SphereGeometry(radius, widthSegments, heightSegments));
        }

        {
            const radius = 7;
            this.addSolidGeometry(-2, -1, new THREE.TetrahedronGeometry(radius));
        }

        this.addText();

        {
            const radius = 5;
            const tubeRadius = 2;
            const radialSegments = 8;
            const tubularSegments = 24;
            this.addSolidGeometry(0, -1, new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments));
        }

        {
            const radius = 3.5;
            const tube = 1.5;
            const radialSegments = 8;
            const tubularSegments = 64;
            const p = 2;
            const q = 3;
            this.addSolidGeometry(1, -1, new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q));
        }

        {
            class CustomSinCurve extends THREE.Curve {
                constructor(scale) {
                    super();
                    this.scale = scale;
                }

                getPoint(t) {
                    const tx = t * 3 - 1.5;
                    const ty = Math.sin(2 * Math.PI * t);
                    const tz = 0;
                    return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
                }
            }

            const path = new CustomSinCurve(4);
            const tubularSegments = 20;
            const radius = 1;
            const radialSegments = 8;
            const closed = false;
            this.addSolidGeometry(2, -1, new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed));
        }

        {
            const width = 8;
            const height = 8;
            const depth = 8;
            const thresholdAngle = 15;
            this.addLineGeometry(-1, -2, new THREE.EdgesGeometry(
                new THREE.BoxGeometry(width, height, depth),
                thresholdAngle)
            );
        }

        {
            const width = 8;
            const height = 8;
            const depth = 8;
            this.addLineGeometry(1, -2, new THREE.WireframeGeometry(new THREE.BoxGeometry(width, height, depth)));
        }
    }

    async addText() {
        const loader = new FontLoader();
        const font = await loadFont(loader, '../fonts/helvetiker/helvetiker_regular.typeface.json');
        const geometry = new TextGeometry('three.js', {
            font: font,
            size: 3.0,
            height: 0.2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: 0.3,
            bevelSegments: 5
        });
        const material = this.createSolidMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        geometry.computeBoundingBox();
        geometry.boundingBox
            .getCenter(mesh.position)
            .multiplyScalar(-1);

        const parent = new THREE.Object3D();
        parent.add(mesh);

        this.addObject(-1, -1, parent);
    }
}


new ThreejsExample(document.querySelector('#webglOutput'));
