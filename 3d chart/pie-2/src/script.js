//******************
// Util functions

// A function to Detect touch devices - solution by Gregers Rygg
// maybe look for better one
function isTouchDevice() {
   var el = document.createElement('div');
   el.setAttribute('ongesturestart', 'return;');
   if(typeof el.ongesturestart == "function"){
      return true;
   }else {
      return false
   }
}

// A function to calcuate lighter hex colour for the wireframe 
// courtesy of Craig Buckler:
// http://www.sitepoint.com/javascript-generate-lighter-darker-color/

function colorLuminance(hex, lum) {  
    // validate hex string  
    hex = String(hex).replace(/[^0-9a-f]/gi, '');  
    if (hex.length < 6) {  
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];  
    }
    lum = lum || 0;  
    // convert to decimal and change luminosity  
    var rgb = "", c, i;  
    for (i = 0; i < 3; i++) {  
        c = parseInt(hex.substr(i*2,2), 16);  
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);  
        rgb += ("00"+c).substr(c.length);  
    }
    return rgb;  
};


// Function to get the max value in a 2-dimensional array
function getMaxArr(arr){
  var maxVal = arr[0][0];
  for( var i=0; i<arr.length; i++ ){
    for ( var j=0; j<arr[i].length; j++ ){
      if( arr[i][j] > maxVal) maxVal = arr[i][j];
    }
  }
  return maxVal;
}

// Function to get the max value in a 2-dimensional array
function getMinArr(arr){
  var minVal = arr[0][0];
  for( var i=0; i<arr.length; i++ ){
    for ( var j=0; j<arr[i].length; j++ ){
      if( arr[i][j] < minVal) minVal = arr[i][j];
    }
  }
  return minVal;
}

// Gets the closest rounding of the max value
function getRoundMax (val){
  
  var powsign = -1;
  if( val < 1 && val > -1){
    var roundRatio = 1;
  }else{
    var maxLength = val.toString().length;
    var roundRatio = Math.pow( 10, powsign*(maxLength-1) );
  }
  
  if( val > 0){
    return Math.ceil(val*roundRatio)/roundRatio;
  }else{
    return Math.round(val*roundRatio)/roundRatio;
  }
  
}

// function to get total count in two dimentional array
function getTotalArr(arr){
  var total = 0;
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < arr[i].length; j++) {
      if ( typeof arr[i][j] != 'number' ) arr[i][j] = 0;
      total += arr[i][j];
    }
  }
  return total;
}

// funciton to update the legend div - requires jQuery
function initLegend(el, schema){
  el.empty();
  for ( var i=0; i<schema.cols.length; i++){
    el.append('<div style="margin-right:5px; background-color:#'+
                schema.cols[i].color+'" class="div-legend-color left"></div>'+
               '<div class="left" style="margin-right:10px;">'+
                schema.cols[i].name+'</div>');
  }
  el.append ('<div class="clear"></div>');
}

// function to return canvas scale texts
function createTextureScale ( text, h, line, size, color, backGroundColor, align ) {

  var backgroundMargin = 10;
  
  var canvas = document.createElement("canvas");

  var context = canvas.getContext("2d");
  context.font = size + "px Arial";

  var textMaxWidth = context.measureText(text[0].name).width;
  for ( var i=1; i<text.length; i++ ){
    var textWidth = context.measureText(text[i]).width;
    if ( textWidth>textMaxWidth ) textMaxWidth = textWidth;
  }

  canvas.width = textMaxWidth + backgroundMargin;
  canvas.height = h + backgroundMargin;
  context = canvas.getContext("2d");
  
  context.font = size + "px Arial";

  if(backGroundColor) {
    context.beginPath();
    context.rect(0, 0, canvas.width , canvas.height);
    context.fillStyle = backGroundColor;
    context.fill();
  }

  context.textAlign = align;
  context.textBaseline = "middle";
  
  var xpos = backgroundMargin;
  if( align == "right") xpos = textMaxWidth-backgroundMargin;
  
  for ( var i=0; i<text.length; i++ ){
    context.fillStyle = color;
    if ( text[i].color )  context.fillStyle = "#"+text[i].color;
    context.fillText(text[i].name, xpos, i*line+line/2);
  }
  
  return canvas;
  
}

// three.js camera mouse/touch controls

function mouseControls ( camera ){
  
  controls = new THREE.OrbitControls( camera, renderer.domElement );
  
  // funciton to get the mouse position for the hover efect onthe pies
  $(document).mousemove(function(event) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  });

  // function to adjust the size of the canvas when resizing the window
  $(window).resize(function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
  });
  
  return controls;
  
}

function detectRenderer (){
  
  // Detecting the renderer - from webgl detector
  var ifcanvas = !! window.CanvasRenderingContext2D;
  var ifwebgl = ( function () { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } } )();
  
  // Init vars and scene depending on the renderer
  if ( ifwebgl ) {
    return 'webgl'
  }
  else if ( ifcanvas ) {
    return 'canvas'
  }
  else {
    return 'none';
  }
}

// Ajax token functions - from Django docs
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

PiePart = function( val, totalval, radius, angprev, pos, extrude, color, valcolor, render, html_label, titles ,font) {
  
  // The render type - can be light and full
  this.renderType = render;
  
  //the 3D cube object
  this.pieobj = null;
  
  // the 3D object for the text label
  this.labelobj = null
  
  // should it have a label. The HTML one should point to a dom element
  this.hasLabel = true;
  this.hasHTMLLabel = html_label;
  
  // should it cast/receive shadows
  this.hasShadows = true;
  
  // the position (usually 0;0;0)
  this.position = pos;
  
  // the radius size 
  this.radius = radius;
  
  // the previous angle - this one should start from it
  this.angPrev = angprev;
  
  // value and Total
  this.val = val;
  this.valTotal = totalval;
  
  // rows and column titles
  this.titles = titles;
  
  // extrude options
  this.extrudeOpts = extrude;
  
  // main cube colour
  this.color = parseInt(color,16);
  this.htmlcolor = "#"+color;
  this.valcolor = parseInt(valcolor,16);
  this.lumcolor = colorLuminance( color, 0.5 );
  this.darklumcolor = colorLuminance( color, -0.6 );
  
  // label vars
  this.labelSize = 60;
  this.labelHeight = 6;
  this.labelFont = font;
  
  // function to add the bar to the scene and position it
  this.addPie = function( target ){
    
    // Material for the bars with transparency
    var material = new THREE.MeshPhongMaterial( {
                                                 color: this.color,
                                                 specular: 0x777777,
                                                 shininess: 100,
                                                 shading : THREE.SmoothShading,
                                                 transparent: true
                                                } );
                                                
    //  if we want a lower quality renderer - mainly with canvas renderer
    if( this.renderType == 'light' ){
      var material = new THREE.MeshLambertMaterial( { color: this.color, 
                                                      shading: THREE.FlatShading, 
                                                      overdraw: true } );
    }
    
    // Creats the shape, based on the value and the radius
    var shape = new THREE.Shape();
    var angToMove = (Math.PI*2*(this.val/ this.valTotal));
    shape.moveTo(this.position.x,this.position.y);
    shape.arc(this.position.x,this.position.y,pieRadius,this.angPrev,
              this.angPrev+angToMove,false);
    shape.lineTo(this.position.x,this.position.y);
    nextAng = this.angPrev + angToMove;

    var geometry = new THREE.ExtrudeGeometry( shape, this.extrudeOpts );

    // Creating the 3D object, positioning it and adding it to the scene
    this.pieobj = new THREE.Mesh( geometry, material );
    this.pieobj.rotation.set(Math.PI/2,0,0);
    // Adds shadows if selected as an option
    if( this.hasShadows ){
      this.pieobj.castShadow = true;
      this.pieobj.receiveShadow = true;
    }
    target.add( this.pieobj );
    
    // If we want to have a label, we add a text object
    if(this.hasLabel){
      
      var percent = Math.round( (this.val/this.valTotal*100) * 10 ) / 10;
      var txt = this.val.toString() + " (" +
                percent.toString() +"%)";
      var curveSeg = 3;
      var material = new THREE.MeshPhongMaterial( { color: this.valcolor, 
                                                    shading: THREE.FlatShading } );
      
      if( this.renderType == 'light' ){
        curveSeg = 1;
        material = new THREE.MeshBasicMaterial( { color: this.valcolor } );
      }
      
      // Create a three.js text geometry
      var geometry = new THREE.TextGeometry( txt, {
        size: this.labelSize,
        height: this.labelHeight,
        curveSegments: curveSeg,
        font: this.labelFont,
        weight: "bold",
        style: "normal",
        bevelEnabled: false
      });
      
      // calculates the positon of the text
      this.valcolor = parseInt(valcolor,16);
      var txtAng = this.angPrev + angToMove/2;
      var txtRad = this.radius * 0.8;
      
      
      // Positions the text and adds it to the scene
      this.labelobj = new THREE.Mesh( geometry, material );
      this.labelobj.position.z -= this.labelSize/2;
      this.labelobj.position.x = txtRad * Math.cos(txtAng);
      this.labelobj.position.y = txtRad * Math.sin(txtAng);
      this.labelobj.rotation.set(3*Math.PI/2,0,0);
      
      // Adds shadows if selected as an option
      if( this.hasShadows ){
        this.labelobj.castShadow = true;
        this.labelobj.receiveShadow = true;
      }
      this.pieobj.add( this.labelobj );
      
      // hides the label at the beginning
      this.hideLabel();
      
    }
    
    return nextAng;
    
  };
  
  // function to show the label
  this.showLabel = function( posx, posy ){
  
    // Shows 3D label if set
    if(this.hasLabel){
      this.labelobj.visible = true;
    }
    
    // Shows HTML Label if set - uses jquery for DOM manipulation
    if ( this.hasHTMLLabel ) {
      this.hasHTMLLabel.html( this.titles.col + 
                              '<p>'+val+'</p>' );
      this.hasHTMLLabel.show();
      // Back transformation of the coordinates
      posx = ( ( posx + 1 ) * window.innerWidth / 2 );
      posy = - ( ( posy - 1 ) * window.innerHeight / 2 );
      this.hasHTMLLabel.offset( { left: posx, top: posy } );
    }
    
  };
  
  // function to hide the label
  this.hideLabel = function(){
  
    // Hides 3D label if set
    if( this.hasLabel ) {
      this.labelobj.visible = false;
    }
    
    // Hides HTML Label if set - uses jquery for DOM manipulation
    if ( this.hasHTMLLabel ) {
      this.hasHTMLLabel.hide();
    }
    
  };
  
  
};

// *** GLOBAL VARIABLES *******************************************************
// ****************************************************************************

// Main scene vars
var camera, scene, renderer,raycaster;
var mouse = { }, touch = { },  INTERSECTED, intersectedId;

// pies array
var pies, intersobj;

// data vars
var totalVal, curAngle;


// *** VARIABLES INITIALIZATION ***********************************************
// ****************************************************************************

function initSceneVars(){
  
  // mouse/touch position
  //-3000 to make ot out of the screen
  mouse.x = -3000;
  mouse.y = -3000;
  touch.x = -3000;
  touch.y = -3000;
  touch.device = false;
  INTERSECTED = null;
  intersectedId = null;
  
  // pies array
  pies = [];
  intersobj = [];
  
  // data vars
  // Calclulating total value of all fields
  totalVal = getTotalArr ( dataValues ); 
  // Setting the current angle of rotation
  curAngle = 0;
  
  // changes background colour
  $('body').css('background-color', '#'+backColor);
  
  // removes previous canvas if exists
  $('canvas').remove();
  
  // Creating new scene
  scene = new THREE.Scene();
  
  // Setting the camera
  camera = new THREE.PerspectiveCamera( 70, 
                                        window.innerWidth/window.innerHeight,
                                        1, 
                                        5000 );
  camera.position.z = 1200;
  camera.position.x = 500;
  camera.position.y = 700;
  
}


// *** SCENE INITIALIZATION FOR WEBGL RENDERER ********************************
// ****************************************************************************

function initWebGLScene (font) {
  
  // Setting the renderer (with shadows)
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  
  // Switch off the shadows for safari due to the three.js bug with it

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
  
  $('body').append( renderer.domElement );
 
  //*** Adding pies
  for ( var i=0; i<schema.cols.length; i++ ) {
    if( dataValues[i][0] > 0 ){
      pies.push( new PiePart( dataValues[i][0], totalVal, pieRadius, 
                              curAngle, {x:0,y:0,z:0}, extrudeOpts, 
                              schema.cols[i].color, valTextColor, "full", null,
                              { col: schema.cols[i].name },font ) );
      curAngle = pies[pies.length-1].addPie(scene);
      // Adds the pies objects to ones that need to be checked for intersection
      // This is used for the moseover action
      intersobj[pies.length-1] = pies[pies.length-1].pieobj;
      intersobj[pies.length-1].pieid = pies.length-1;
    }
  }
  
  //////////////////
  
  //*** Adding the lights
  var light = new THREE.DirectionalLight( 0x777777 );
  light.position.set( 1, -1, 1 ).normalize();
  scene.add( light );
  
  var light = new THREE.DirectionalLight( 0x777777 );
  light.position.set( -1, 1, -1 ).normalize();
  scene.add( light );
  
  light = new THREE.SpotLight( 0xffffff, 1 );
  light.position.set( 600, 3000, 1500 );
  light.target.position.set( 0, 0, 0 );
  
  light.shadow.camera.near = 1000;
  light.shadow.camera.far = 5000;
  light.shadow.camera.fov = 40;
  light.castShadow = true;
  light.shadow.bias = 0.0001;
  // light.shadowCameraVisible  = true;
  scene.add( light );
  ////////////////////

}



// *** SCENE INITIALIZATION ***************************************************
// ****************************************************************************

function initScene (font) {
  // console.log(font)
  // Detecting the renderer:
  var browserRender = detectRenderer ( );
  // Init vars and scene depending on the renderer
  if ( browserRender == 'webgl' ) {
    initSceneVars ();
    initWebGLScene (font);
  }
  else {
    nonSupportedBrowsers();
  }
  
  controls = mouseControls ( camera , 500, 3500 );
  raycaster = new THREE.Raycaster();
}


// *** SCENE ANIMATION ********************************************************
// ****************************************************************************

function animateScene() {

  requestAnimationFrame( animateScene );
  
  // Updateing the controls for the trackball camera
  controls.update();
  
  // find intersections - from the Mr.Doob example
  // url: http://mrdoob.github.com/three.js/examples/webgl_interactive_cubes.html
  
  // Checks first if it's touch or mouse device
  if (!touch.device) {
    var actCoord = { x: mouse.x, y: mouse.y };
  }else{
    var actCoord = { x: touch.x, y: touch.y };
  }
  
   camera.updateMatrixWorld();


  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );

  
  if ( intersects.length > 0 ) {
    if ( INTERSECTED != intersects[ 0 ].object ) {
      if ( INTERSECTED ) {
        INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        pies[intersectedId].hideLabel();
      }
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 
              parseInt( pies[intersects[0].object.pieid].darklumcolor, 16 ) );
      pies[intersects[0].object.pieid].showLabel( actCoord.x, actCoord.y );
      intersectedId = intersects[0].object.pieid;
    }
  } else {
    if ( INTERSECTED ) {
      INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      pies[intersectedId].hideLabel();
    }
    intersectedId = null;
    INTERSECTED = null;
  }

  renderer.render( scene, camera );

}

var pieHeight = 150;
var pieRadius = 750;
var extrudeOpts = { amount: pieHeight, 
                    bevelEnabled: true, 
                    bevelSegments: 5, 
                    steps: 5 };
var valTextColor = "ffffff";
var schema={'cols':[
            {"color":"d17100","name":"2010"},{
            "color":"d9bd00","name":"2011"},{
              "color":"61c900","name":"2012"},
              {"color":"d82929","name":"2013"}],
            "rows":[{"name":"pro1"}]};

var dataValues=[[899],[287],[720],[320]];
var backColor='000000';


var loader = new THREE.FontLoader();
loader.load( 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function ( font ) {
  initScene(font);
  animateScene();
});

