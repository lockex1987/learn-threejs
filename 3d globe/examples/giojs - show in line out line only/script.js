// Get the container to hold the IO globe
var containerIn = document.getElementById("outlineArea");
var containerOut = document.getElementById("inlineArea");

// Create Gio.controller
var controllerIn = new GIO.Controller(containerIn);
var controllerOut = new GIO.Controller(containerOut);

// Add data and initialize the globe
controllerIn.addData(data);
controllerIn.init();
controllerOut.addData(data);
controllerOut.init();

// use showOutOnly API to only show out lines
// set parameter to be false can disable showOutOnly
controllerIn.showOutOnly(true);
// use showInOnly API to only show in lines
// set parameter to be false can diable showInOnly
controllerOut.showInOnly(true);