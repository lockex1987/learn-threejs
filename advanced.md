[Các ví dụ sách Học Three.js (old)](https://cttd.tk/posts/js%20-%20three.js/)

## Shader

Kiểu như code C.

## Globe Map

Cần hiển thị được các nước.

[Andrey Sitnik](https://sitnik.ru/en/)

[ai/sitnik.ru: My homepage content and scripts](https://github.com/ai/sitnik.ru)

[Faster WebGL/Three.js 3D graphics with OffscreenCanvas and Web Workers - DEV Community](https://dev.to/evilmartians/faster-webgl-three-js-3d-graphics-with-offscreencanvas-and-web-workers-43he)

Demo

- [3D Globe Map 1](3d globe/globe 1/index.html)
- [3D Globe với thư viện amCharts](../js - amcharts/examples/map-globe-with-projected-circles/index.html)
- [Hàm callback khi chọn nước](3d globe/examples/19 api on country picked.html)
- [Chủ động chọn nước](3d globe/examples/20 api switch country.html)
- [WebGL Earth](3d globe/thematic mapping/index.html)
- [Pure JS with canvas](3d globe/pure js and canvas/index.html)
- [World Population Density](3d globe/world-population-density/index.html)
- [Three.js Earth](3d globe/three-js-earth/index.html)

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


​      

[HTML5: Render open data on a 3D world globe with Three.js](http://www.smartjava.org/content/html5-render-open-data-3d-world-globe-threejs/)

Thư viện khác:

[Gio.js](https://giojs.org/)

![Gio logo](images/gio-logo.png)


​      

```
$ cd new/sitnik.ru-main/
$ npm install
npm notice created a lockfile as package-lock.json. You should commit this file.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@~2.3.2 (node_modules/rollup/node_modules/fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.3.2: wanted {"os":"darwin","arch":"any"} (current: {"os":"linux","arch":"x64"})
npm WARN eslint-config-standard@16.0.3 requires a peer of eslint@^7.12.1 but none is installed. You must install peer dependencies yourself.
npm WARN eslint-config-standard@16.0.3 requires a peer of eslint-plugin-promise@^4.2.1 || ^5.0.0 but none is installed. You must install peer dependencies yourself.

added 572 packages from 333 contributors in 30.22s

104 packages are looking for funding
  run `npm fund` for details

$ npm run build

> @ build /home/huyennv9/new/sitnik.ru-main
> NODE_ENV=production ./scripts/build.js

✔ Load location 0 ms
✔ Clean dist/ 2 ms
✔ Save location cache 11 ms
✔ Copy images 138 ms
✔ Compile styles 220 ms
✔ Bundle scripts 5387 ms
✔ Update nginx.conf 136 ms
✔ Compile HTML 137 ms
✔ Precompess assets 18 ms
$ npm run start

> @ start /home/huyennv9/new/sitnik.ru-main
> serve dist/

WARNING: Checking for updates failed (use `--debug` to see full error)

   ┌───────────────────────────────────────────────────┐
   │                                                   │
   │   Serving!                                        │
   │                                                   │
   │   - Local:            http://localhost:3000       │
   │   - On Your Network:  http://172.16.40.196:3000   │
   │                                                   │
   │   Copied local address to clipboard!              │
   │                                                   │
   └───────────────────────────────────────────────────┘
```


​      




​      





## 3D Chart

[Pie](https://codepen.io/Developer_sunset/pen/mXbEGz)

[Pie-2](https://codepen.io/talyYang/pen/bRbKRM)

Column (cube)

Trục

Label

[Learning Three.js With Real World Challenges (that have already been solved) - data analysis, data visualization, three.js - Bocoup](https://bocoup.com/blog/learning-three-js-with-real-world-challenges-that-have-already-been-solved)

[Three.js - wooden bar chart / David B. / Observable](https://observablehq.com/@bumbeishvili/three-js-wooden-bar-chart)

[3D bar chart port / David B. / Observable](https://observablehq.com/@bumbeishvili/3d-bar-chart-port?collection=@bumbeishvili/3d)

[3D / David B. / Observable](https://observablehq.com/collection/@bumbeishvili/3d)

Cảm hứng từ các video sau:

[EVOLUTION of WORLD'S TALLEST BUILDING: Size Comparison (1901-2022) - YouTube](https://www.youtube.com/watch?v=PuTqWxuAazI)

[TOP Richest Person Comparison (wealthiest people on the planet comparison) - YouTube](https://www.youtube.com/watch?v=R6nSQBD-3aA)

[Tallest statue size comparison 3d animation - YouTube](https://www.youtube.com/watch?v=YEPJDkZRdJU)

[MetaBallStudios - YouTube](https://www.youtube.com/channel/UCQwFuQLnLocj5F7ZcmcuWYQ)

Demo:

[Area chart](3d chart/area-chart/index.html)

[Line chart](3d chart/line-chart/index.html)

[Column chart](3d chart/column-chart/index.html)

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
