// Get the container to hold the IO globe
var container = document.getElementById("globalArea");
// Create Gio.controller
var controller = new GIO.Controller(container);
// Add data
controller.addData(data);
// Initialize and render the globe
controller.init();