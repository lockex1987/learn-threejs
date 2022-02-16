// import { TrackballControls } from 'https://unpkg.com/three@0.137.5/examples/jsm/controls/TrackballControls.js';
import { TrackballControls } from '../three/examples/jsm/controls/TrackballControls.js';
import Stats from 'https://unpkg.com/three@0.137.5/examples/jsm/libs/stats.module.js';


/**
 * Initialize the statistics DOM Element.
 *
 * @param {Number} type 0: fps, 1: ms, 2: mb, 3+: custom
 * @returns stats JS object
 */
function initStats(type = 0) {
    const stats = new Stats();
    stats.showPanel(type); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    return stats;
}

/**
 * Initialize trackball controls to control the scene.
 *
 * @param {THREE.Camera} camera
 * @param {THREE.Renderer} renderer
 */
function initTrackballControls(camera, renderer) {
    const trackballControls = new TrackballControls(camera, renderer.domElement);
    trackballControls.rotateSpeed = 1.0;
    trackballControls.zoomSpeed = 1.2;
    trackballControls.panSpeed = 0.8;
    trackballControls.noZoom = false;
    trackballControls.noPan = false;
    trackballControls.staticMoving = true;
    trackballControls.dynamicDampingFactor = 0.3;
    trackballControls.keys = [65, 83, 68];
    return trackballControls;
}


export {
    initStats,
    initTrackballControls
};
