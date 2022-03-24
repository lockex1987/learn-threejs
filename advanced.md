[Các ví dụ sách Học Three.js (old)](https://cttd.tk/posts/js%20-%20three.js/)

## Shader

Kiểu như code C.

[The Book of Shaders](https://thebookofshaders.com/)

[Jam3/jam3-lesson-webgl-shader-intro: A brief introduction to fragment shaders.](https://github.com/Jam3/jam3-lesson-webgl-shader-intro)

[Jam3/jam3-lesson-webgl-shader-threejs: Using custom vertex and fragment shaders in ThreeJS](https://github.com/Jam3/jam3-lesson-webgl-shader-threejs)

[Shader 1: Rim lighted sphere](http://localhost:8000/shader/shader1.html)

## 3D Globe

Map, Chart? Cần hiển thị được các nước.

Demo:

[Globe 1](http://localhost:8000/3d%20globe/globe1.html)

[Globe 2](http://localhost:8000/3d%20globe/globe2.html)

[Globe 3](http://localhost:8000/3d%20globe/globe3.html)

[Globe 4](http://localhost:8000/3d%20globe/globe4.html)

[Globe 5](http://localhost:8000/3d%20globe/globe5.html)

[Hello World (Simplest Usage) / Gio.js](http://localhost:8000/3d%20globe/examples/00_hello_world(simplest).html)

[API switchCountry() / Gio.js](http://localhost:8000/3d%20globe/examples/20%20api%20switch%20country.html)

[API onCountryPicked() / Gio.js](http://localhost:8000/3d%20globe/examples/19%20api%20on%20country%20picked.html)

[Map globe with projected circles](https://lockex1987.com/posts/js%20-%20amcharts/examples/map-globe-with-projected-circles/index.html)

Bắt đầu từ:

[dataarts/webgl-globe: WebGL Globe is a platform for visualizing latitude longitude based information using WebGL](https://github.com/dataarts/webgl-globe)

[WebGL Globe - Experiments with Google](https://experiments.withgoogle.com/chrome/globe)

Lấy cảm hứng từ trên:

[vasturiano/three-globe: WebGL Globe Data Visualization as a ThreeJS reusable 3D object](https://github.com/vasturiano/three-globe)

Wrapper:

[vasturiano/globe.gl: UI component for Globe Data Visualization using ThreeJS/WebGL](https://github.com/vasturiano/globe.gl)

[Globe.GL](https://globe.gl/)

Hướng dẫn:

[How To Make The Earth In WebGL? - Learning Three.js](http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/)

[Intermediate Three.js Tutorial - Create a Globe with Custom Shaders - YouTube](https://www.youtube.com/watch?v=vM8M4QloVL0)

[HTML5: Render open data on a 3D world globe with Three.js](http://www.smartjava.org/content/html5-render-open-data-3d-world-globe-threejs/)

Thư viện khác:

[Gio.js](https://giojs.org/)

![Gio logo](images/gio-logo.png)

## 3D Chart

Pie

Column (cube)

Trục

Label

Cảm hứng từ các video sau:

[EVOLUTION of WORLD'S TALLEST BUILDING: Size Comparison (1901-2022) - YouTube](https://www.youtube.com/watch?v=PuTqWxuAazI)

[TOP Richest Person Comparison (wealthiest people on the planet comparison) - YouTube](https://www.youtube.com/watch?v=R6nSQBD-3aA)

[Tallest statue size comparison 3d animation - YouTube](https://www.youtube.com/watch?v=YEPJDkZRdJU)

[MetaBallStudios - YouTube](https://www.youtube.com/channel/UCQwFuQLnLocj5F7ZcmcuWYQ)

Demo:

[Area chart](http://localhost:8000/3d%20chart/area-chart/index.html)

[Line chart](http://localhost:8000/3d%20chart/line-chart/index.html)

[Column chart](http://localhost:8000/3d%20chart/column-chart/index.html)

## Export video

Ví dụ

## Shadow

Bóng tốn nhiều hiệu năng.

Phim ảnh cần hình ảnh trung thực, do đó render sẽ lâu, nhưng là render trước rồi chiếu sau, không phải real-time.

Để có bóng, chúng ta cần:

```javascript
renderer.shadowMap.enabled = true;
light.castShadow = true;
mesh.castShadow = true;
plane.receiveShadow = true;
```

Các loại nguồn sáng sau thì tạo bóng: DirectionalLight, PointLight, SpotLight. AmbientLight và HemisphereLight không tạo bóng.

Cần tối ưu.

Shadow map

light.shadow.mapSize.width

light.shadow.mapSize.height

Kích thước nên là mũ 2.

light.shadow.camera.near

light.shadow.camera.far

light.shadow.camera.top

light.shadow.camera.left

light.shadow.camera.right

light.shadow.camera.bottom

Sử dụng CameraHelper(light.shadow.camera)

Các thuật toán tạo bóng: renderer.shadowMap.type

Baking shadow: Tạo một Mesh để thể hiện bóng, di chuyển theo vật

https://threejs.org/manual/#en/shadows

## Các ví dụ lẻ

Tự tạo hình lập phương bằng các điểm và các mặt (tạo hình tam giác cho đơn giản).

Phần trăm tải

3D Logo NVH

[40 | Blocky Cutie](https://codepen.io/yitliu/pen/YzXOzMg)

[Yiting Liu on CodePen](https://codepen.io/yitliu/pens/public?cursor=ZD0xJm89MCZwPTEmdj0zNTA1MTMyMw==)

[Example 02.05 - Custom geometry](https://static.lockex1987.com/learn-threejs/old/02-05-custom-geometry.html)

[Solar system](https://static.lockex1987.com/learn-threejs/old/solar-system.html)

[Tank](https://static.lockex1987.com/learn-threejs/old/tank.html)

## Physics

[Physics engine - Wikipedia](https://en.wikipedia.org/wiki/Physics_engine)

[Physics with Cannon - Three.js Tutorials](https://sbcode.net/threejs/physics-cannonjs/)

[Build a simple 2D physics engine for JavaScript games – IBM Developer](https://developer.ibm.com/tutorials/wa-build2dphysicsengine/)

[Building a Physics-based 3D Menu with Cannon.js and Three.js - Codrops](https://tympanus.net/codrops/2019/12/10/building-a-physics-based-3d-menu-with-cannon-js-and-three-js/)

## Render Post-processing

### Thiết lập Three.js cho post-processing

[Example 11.01 - Basic Effect Composer](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/01-basic-effect-composer.html)

Tạo THREE.EffectComposer

Cấu hình THREE.EffectComposer

Cập nhật vòng lặp render

### Post-processing pass

#### Post-processing pass đơn giản

[Example 11.02 - Simple Pass Effects - 1](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/02-simple-pass-1.html)

Film, Bloom, DotScreen.

Sử dụng THREE.FilmPass để tạo hiệu ứng giống TV

Thêm hiệu ứng boom với THREE.BloomPass

Output Scene như là một tập các điểm

Hiển thị đầu ra của nhiều renderer trên cùng màn hình

Thêm pass đơn giản

[Example 11.03 - Simple Pass Effects - 2](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/03-simple-pass-2.html)

Outline, Glitch, Unreal, Halftone.

### Luồng EffectComposer nâng cao sử dụng mark

[Example 11.04 - Post processing masks](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/04-post-processing-masks.html)

### Pass Bokeh nâng cao

[Example 11.05 - Bokeh](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/05-bokeh.html)

### Pass ambient occlusion nâng cao

[Example 11.06 - Ambient Occlusion](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/06-ambient-occlusion.html)

### Sử dụng THREE.ShaderPass cho các hiệu ứng điều chỉnh

[Example 11.07 - Shader pass simple](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/07-shader-pass-simple.html)

Shader đơn giản

### Shader blur

[Example 11.08 - Blur passes](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/08-shader-pass-blur.html)

### Tạo post-processing shader điều chỉnh

Điều chỉnh grayscale shader

Tạo một bit shader điều chỉnh

[Example 11.09 - Basic Effect Composer](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/09-shader-pass-custom.html)

### Thừa một số file ví dụ (không chạy được)

[Example 11.03 - Post processing masks](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/103-post-processing-masks.html)

[Example 11.04 - Shader Pass simple](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/104-shaderpass-simple.html)

[Example 11.04 - Shader Pass simple blur](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/105-shaderpass-blur.html)

[Example 11.06 - Advanced](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/106-shaderpass-advanced.html)

[Example 11.07 - custom shaderpass](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-11/107-shaderpass-custom.html)

## Thêm vật lý và âm thanh

Tạo một Three.js Scene cơ bản với vật lý

[Example 12.01 - Dominos](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/01-dominos.html)

Các thuộc tính Physi.js material

[Example 12.02 - Material](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/02-material.html)

Các hình Physi.js hỗ trợ

[Example 12.03 - Shapes](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/03-shapes.html)

Sử dụng ràng buộc giới hạn chuyển động của các đối tượng

[Example 12.04 - Point Constraint](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/04-point-constraint.html)

[Example 12.05 - Sliders and hinges](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/05-sliders-hinges.html)

[Example 12.06 - DOF Constraint](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/06-dof-constraint.html)

Thêm âm thanh

[Example 12.07 - Audio](https://cttd.tk/posts/js%20-%20three.js/learn%20three.js/src/chapter-12/07-audio.html)
