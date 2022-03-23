# three.js Earth

A Pen created on CodePen.io. Original URL: [https://codepen.io/qkevinto/pen/EVGrGq](https://codepen.io/qkevinto/pen/EVGrGq).

Wait a bit for the textures to load!

Made with the help of http://learningthreejs.com/blog/2013/09/16/how-to-make-the-earth-in-webgl/

Textures from http://planetpixelemporium.com/planets.html

Though some of the information there is outdated or omitted. Use THREE.TextureLoader() instead of THREE.ImageUtils.loadTexture(), and instead of using the unexplained canvasCloud, use alphaMap property on the cloud material to add a transparency map, making sure the blacks in the image corresponds to 100% transparency, white is 0% transparency, and everything in between.

You can also place a marker on the globe!

Go to Surface > Markers, type in an address into the field, pick your colour and click placeMarker.
This uses Google's Geocode API to get the longitude and latitude of the address and that is then coverted
to Vector3 coordinate relative to the Earth's surface.
