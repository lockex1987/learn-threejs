var containerOriginal = document.getElementById("originalArea");
var containerChanged = document.getElementById("changedArea");

var controllerOriginal = new GIO.Controller(containerOriginal);
var controllerChanged = new GIO.Controller(containerChanged);

controllerOriginal.addData(data);
controllerOriginal.init();
controllerChanged.addData(data);
controllerChanged.init();

// use the setExportColor() API to change the export line's color
controllerChanged.setExportColor("#FEF504");
// use the setImportColor() API to change the export line's color
controllerChanged.setImportColor("#00FF00");