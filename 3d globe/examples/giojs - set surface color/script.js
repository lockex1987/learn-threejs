// Get the container to hold the IO globe
var containerOriginal = document.getElementById( "originalArea" );
var containerChanged = document.getElementById( "changedArea" );

// Create Gio.controller
var controllerOriginal = new GIO.Controller( containerOriginal );
var controllerChanged = new GIO.Controller( containerChanged );

// Add data and initialize the globe
controllerOriginal.addData( data );
controllerOriginal.init();
controllerChanged.addData( data );
controllerChanged.init();

// use setSurfaceColor API to change the surface color, try to change the color parameter!
controllerChanged.setSurfaceColor( 0x00FF00 );