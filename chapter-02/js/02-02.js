import {
    BoxGeometry,
    BufferGeometry,
    CircleGeometry,
    Color,
    ConeGeometry,
    Curve,
    CylinderGeometry,
    DodecahedronGeometry,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    IcosahedronGeometry,
    LatheGeometry,
    LineSegments,
    LineBasicMaterial,
    Mesh,
    MeshPhongMaterial,
    OctahedronGeometry,
    PerspectiveCamera,
    PlaneGeometry,
    PointLight,
    RingGeometry,
    Scene,
    Shape,
    ShapeGeometry,
    SphereGeometry,
    TetrahedronGeometry,
    TorusGeometry,
    TorusKnotGeometry,
    TubeGeometry,
    Vector2,
    Vector3,
    WireframeGeometry,
    WebGLRenderer
} from 'three';

import { GUI } from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/OrbitControls.js';


const twoPi = Math.PI * 2;

const group = new Group();

let gui = new GUI();


function addSelectGeometryOptions(initGeometry = 'BoxGeometry') {
    gui.add({ selectedGeometry: initGeometry }, 'selectedGeometry')
        .options([
            'BoxGeometry',
            'CylinderGeometry',
            'ConeGeometry',
            'CircleGeometry',
            'DodecahedronGeometry',
            'IcosahedronGeometry',
            'LatheGeometry',
            'OctahedronGeometry',
            'PlaneGeometry',
            'RingGeometry',
            'SphereGeometry',
            'TetrahedronGeometry',
            'TorusGeometry',
            'TorusKnotGeometry',
            'TubeGeometry',
            'ShapeGeometry',
            'ExtrudeGeometry'
        ])
        .onChange(selectedGeometry => {
            gui.destroy();
            gui = new GUI();
            addSelectGeometryOptions(selectedGeometry);
            guis[selectedGeometry](group);
        })
        .name('Geometry');

    // Link đến trang documentation
    gui.add({
        link() {
            const url = 'https://threejs.org/docs/index.html#api/en/geometries/' + initGeometry;
            // window.location = url;
            window.open(url, '_blank').focus();
        }
    }, 'link')
        .name('Link');
}


/**
 * Phục vụ TubeGeometry thôi.
 */
class CustomSinCurve extends Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(t, optionalTarget = new Vector3()) {
        const tx = t * 3 - 1.5;
        const ty = Math.sin(2 * Math.PI * t);
        const tz = 0;
        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}


function updateGroupGeometry(group, geometry) {
    // Xóa cũ
    group.children[0].geometry.dispose();
    group.children[1].geometry.dispose();

    // Tạo mới
    group.children[0].geometry = new WireframeGeometry(geometry);
    group.children[1].geometry = geometry;

    // these do not update nicely together if shared
}


const guis = {
    // Hình hộp
    BoxGeometry(group) {
        const data = {
            width: 15,
            height: 15,
            depth: 15,
            widthSegments: 1,
            heightSegments: 1,
            depthSegments: 1
        };

        function generateGeometry() {
            const geometry = new BoxGeometry(
                data.width,
                data.height,
                data.depth,
                data.widthSegments,
                data.heightSegments,
                data.depthSegments
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.BoxGeometry');
        folder.add(data, 'width', 1, 30).onChange(generateGeometry);
        folder.add(data, 'height', 1, 30).onChange(generateGeometry);
        folder.add(data, 'depth', 1, 30).onChange(generateGeometry);
        folder.add(data, 'widthSegments', 1, 10).step(1).onChange(generateGeometry);
        folder.add(data, 'heightSegments', 1, 10).step(1).onChange(generateGeometry);
        folder.add(data, 'depthSegments', 1, 10).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình trụ
    CylinderGeometry(group) {
        const data = {
            radiusTop: 5,
            radiusBottom: 5,
            height: 10,
            radialSegments: 8,
            heightSegments: 1,
            openEnded: false,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {
            const geometry = new CylinderGeometry(
                data.radiusTop,
                data.radiusBottom,
                data.height,
                data.radialSegments,
                data.heightSegments,
                data.openEnded,
                data.thetaStart,
                data.thetaLength
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.CylinderGeometry');
        folder.add(data, 'radiusTop', 0, 30).onChange(generateGeometry);
        folder.add(data, 'radiusBottom', 0, 30).onChange(generateGeometry);
        folder.add(data, 'height', 1, 50).onChange(generateGeometry);
        folder.add(data, 'radialSegments', 3, 64).step(1).onChange(generateGeometry);
        folder.add(data, 'heightSegments', 1, 64).step(1).onChange(generateGeometry);
        folder.add(data, 'openEnded').onChange(generateGeometry);
        folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình nón
    ConeGeometry(group) {
        const data = {
            radius: 5,
            height: 10,
            radialSegments: 8,
            heightSegments: 1,
            openEnded: false,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {
            const geometry = new ConeGeometry(
                data.radius,
                data.height,
                data.radialSegments,
                data.heightSegments,
                data.openEnded,
                data.thetaStart,
                data.thetaLength
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.ConeGeometry');
        folder.add(data, 'radius', 0, 30).onChange(generateGeometry);
        folder.add(data, 'height', 1, 50).onChange(generateGeometry);
        folder.add(data, 'radialSegments', 3, 64).step(1).onChange(generateGeometry);
        folder.add(data, 'heightSegments', 1, 64).step(1).onChange(generateGeometry);
        folder.add(data, 'openEnded').onChange(generateGeometry);
        folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình tròn
    CircleGeometry(group) {
        const data = {
            radius: 10,
            segments: 32,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {
            const geometry = new CircleGeometry(
                data.radius,
                data.segments,
                data.thetaStart,
                data.thetaLength
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.CircleGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'segments', 0, 128).step(1).onChange(generateGeometry);
        folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // 12 mặt
    DodecahedronGeometry(group) {
        const data = {
            radius: 10,
            detail: 0
        };

        function generateGeometry() {
            const geometry = new DodecahedronGeometry(
                data.radius,
                data.detail
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.DodecahedronGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // 20 mặt
    IcosahedronGeometry(group) {
        const data = {
            radius: 10,
            detail: 0
        };

        function generateGeometry() {
            const geometry = new IcosahedronGeometry(
                data.radius,
                data.detail
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.IcosahedronGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình khuôn tiện
    LatheGeometry(group) {
        const points = [];

        for (let i = 0; i < 10; i++) {
            points.push(new Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
        }

        const data = {
            segments: 12,
            phiStart: 0,
            phiLength: twoPi
        };

        function generateGeometry() {
            const geometry = new LatheGeometry(
                points,
                data.segments,
                data.phiStart,
                data.phiLength
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.LatheGeometry');
        folder.add(data, 'segments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'phiStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'phiLength', 0, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // 8 mặt
    OctahedronGeometry(group) {
        const data = {
            radius: 10,
            detail: 0
        };

        function generateGeometry() {
            const geometry = new OctahedronGeometry(
                data.radius,
                data.detail
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.OctahedronGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Mặt phẳng
    PlaneGeometry(group) {
        const data = {
            width: 10,
            height: 10,
            widthSegments: 1,
            heightSegments: 1
        };

        function generateGeometry() {
            const geometry = new PlaneGeometry(
                data.width,
                data.height,
                data.widthSegments,
                data.heightSegments
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.PlaneGeometry');
        folder.add(data, 'width', 1, 30).onChange(generateGeometry);
        folder.add(data, 'height', 1, 30).onChange(generateGeometry);
        folder.add(data, 'widthSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'heightSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình nhẫn
    RingGeometry(group) {
        const data = {
            innerRadius: 5,
            outerRadius: 10,
            thetaSegments: 8,
            phiSegments: 8,
            thetaStart: 0,
            thetaLength: twoPi
        };

        function generateGeometry() {
            const geometry = new RingGeometry(
                data.innerRadius,
                data.outerRadius,
                data.thetaSegments,
                data.phiSegments,
                data.thetaStart,
                data.thetaLength
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.RingGeometry');
        folder.add(data, 'innerRadius', 1, 30).onChange(generateGeometry);
        folder.add(data, 'outerRadius', 1, 30).onChange(generateGeometry);
        folder.add(data, 'thetaSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'phiSegments', 1, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình cầu
    SphereGeometry(group) {
        const data = {
            radius: 15,
            widthSegments: 32,
            heightSegments: 16,
            phiStart: 0,
            phiLength: twoPi,
            thetaStart: 0,
            thetaLength: Math.PI
        };

        function generateGeometry() {
            const geometry = new SphereGeometry(
                data.radius,
                data.widthSegments,
                data.heightSegments,
                data.phiStart,
                data.phiLength,
                data.thetaStart,
                data.thetaLength
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.SphereGeometry');
        folder.add(data, 'radius', 1, 30).onChange(generateGeometry);
        folder.add(data, 'widthSegments', 3, 64).step(1).onChange(generateGeometry);
        folder.add(data, 'heightSegments', 2, 32).step(1).onChange(generateGeometry);
        folder.add(data, 'phiStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'phiLength', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'thetaStart', 0, twoPi).onChange(generateGeometry);
        folder.add(data, 'thetaLength', 0, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // 4 mặt
    TetrahedronGeometry(group) {
        const data = {
            radius: 10,
            detail: 0
        };

        function generateGeometry() {
            const geometry = new TetrahedronGeometry(
                data.radius,
                data.detail
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.TetrahedronGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'detail', 0, 5).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình xuyến
    TorusGeometry(group) {
        const data = {
            radius: 10,
            tube: 3,
            radialSegments: 16,
            tubularSegments: 100,
            arc: twoPi
        };

        function generateGeometry() {
            const geometry = new TorusGeometry(
                data.radius,
                data.tube,
                data.radialSegments,
                data.tubularSegments,
                data.arc
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.TorusGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'tube', 0.1, 10).onChange(generateGeometry);
        folder.add(data, 'radialSegments', 2, 30).step(1).onChange(generateGeometry);
        folder.add(data, 'tubularSegments', 3, 200).step(1).onChange(generateGeometry);
        folder.add(data, 'arc', 0.1, twoPi).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình xuyến thắt nút
    TorusKnotGeometry(group) {
        const data = {
            radius: 10,
            tube: 3,
            tubularSegments: 64,
            radialSegments: 8,
            p: 2,
            q: 3
        };

        function generateGeometry() {
            const geometry = new TorusKnotGeometry(
                data.radius,
                data.tube,
                data.tubularSegments,
                data.radialSegments,
                data.p,
                data.q
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.TorusKnotGeometry');
        folder.add(data, 'radius', 1, 20).onChange(generateGeometry);
        folder.add(data, 'tube', 0.1, 10).onChange(generateGeometry);
        folder.add(data, 'tubularSegments', 3, 300).step(1).onChange(generateGeometry);
        folder.add(data, 'radialSegments', 3, 20).step(1).onChange(generateGeometry);
        folder.add(data, 'p', 1, 20).step(1).onChange(generateGeometry);
        folder.add(data, 'q', 1, 20).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    // Hình ống
    TubeGeometry(group) {
        const data = {
            segments: 20,
            radius: 2,
            radialSegments: 8
        };

        const path = new CustomSinCurve(10);

        function generateGeometry() {
            const geometry = new TubeGeometry(
                path,
                data.segments,
                data.radius,
                data.radialSegments,
                false
            );
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.TubeGeometry');
        folder.add(data, 'segments', 1, 100).step(1).onChange(generateGeometry);
        folder.add(data, 'radius', 1, 10).onChange(generateGeometry);
        folder.add(data, 'radialSegments', 1, 20).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    ShapeGeometry(group) {
        function createHeartShape() {
            const x = 0;
            const y = 0;
            const heartShape = new Shape();
            heartShape.moveTo(x + 5, y + 5);
            heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
            heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
            heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
            heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
            heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
            heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);
            return heartShape;
        }

        const heartShape = createHeartShape();

        const data = {
            segments: 12
        };

        function generateGeometry() {
            const geometry = new ShapeGeometry(
                heartShape,
                data.segments
            );
            geometry.center();
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.ShapeGeometry');
        folder.add(data, 'segments', 1, 100).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    },

    ExtrudeGeometry(group) {
        const data = {
            steps: 2,
            depth: 16,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 1,
            bevelOffset: 0,
            bevelSegments: 1
        };

        const length = 12;
        const width = 8;

        const shape = new Shape();
        shape.moveTo(0, 0);
        shape.lineTo(0, width);
        shape.lineTo(length, width);
        shape.lineTo(length, 0);
        shape.lineTo(0, 0);

        function generateGeometry() {
            const geometry = new ExtrudeGeometry(shape, data);
            geometry.center();
            updateGroupGeometry(group, geometry);
        }

        const folder = gui.addFolder('THREE.ExtrudeGeometry');
        folder.add(data, 'steps', 1, 10).step(1).onChange(generateGeometry);
        folder.add(data, 'depth', 1, 20).onChange(generateGeometry);
        folder.add(data, 'bevelThickness', 1, 5).step(1).onChange(generateGeometry);
        folder.add(data, 'bevelSize', 0, 5).step(1).onChange(generateGeometry);
        folder.add(data, 'bevelOffset', -4, 5).step(1).onChange(generateGeometry);
        folder.add(data, 'bevelSegments', 1, 5).step(1).onChange(generateGeometry);
        folder.open();

        generateGeometry();
    }
};


function chooseFromHash(group) {
    const selectedGeometry = window.location.hash.substring(1) || 'BoxGeometry';
    if (guis[selectedGeometry] !== undefined) {
        guis[selectedGeometry](group);
    }
    if (selectedGeometry === 'TextGeometry') {
        return {
            fixed: true
        };
    }

    // No configuration options
    return {};
}


function init() {
    const scene = new Scene();
    scene.background = new Color(0x444444);

    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.z = 30;

    const renderer = new WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    document.body.appendChild(renderer.domElement);

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableZoom = false;

    const lights = [];

    lights[0] = new PointLight(0xffffff, 1, 0);
    lights[1] = new PointLight(0xffffff, 1, 0);
    lights[2] = new PointLight(0xffffff, 1, 0);

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute([], 3));
    const lineMaterial = new LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5
    });
    const meshMaterial = new MeshPhongMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: DoubleSide,
        flatShading: true
    });
    group.add(new LineSegments(geometry, lineMaterial));
    group.add(new Mesh(geometry, meshMaterial));

    const options = chooseFromHash(group);
    scene.add(group);

    function render() {
        if (!options.fixed) {
            group.rotation.x += 0.005;
            group.rotation.y += 0.005;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight, false);
    });

    render();
}


addSelectGeometryOptions();
init();
