var containerOriginal = document.getElementById( "originalArea" );
var containerChanged = document.getElementById( "changedArea" );

var controllerOriginal = new GIO.Controller( containerOriginal );
var controllerChanged = new GIO.Controller( containerChanged );

controllerOriginal.addData( data );
controllerOriginal.init();
controllerChanged.addData( data );
controllerChanged.init();

// use setSelectedColor API to change the selected color color, try to change the color parameter!
controllerChanged.setSelectedColor("#FF0000");