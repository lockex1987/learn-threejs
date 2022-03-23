var containerOriginal = document.getElementById( "originalArea" );
var containerChanged = document.getElementById( "changedArea" );

var controllerOriginal = new GIO.Controller( containerOriginal );
var controllerChanged = new GIO.Controller( containerChanged );

controllerOriginal.addData( data );
controllerOriginal.init();
controllerChanged.addData( data );
// use the setInitCountry() API to change the init country, which is the country the globe will rotate to when controller.init() is called.
// Try to change the init Country parameter
controllerChanged.setInitCountry( "US" );
controllerChanged.init();