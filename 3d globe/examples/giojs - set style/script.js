var container = document.getElementById("globalArea");
var controller = new GIO.Controller(container);

// use setStyle API to set a pre-defined style
// replace "strawberry" with other style type, enjoy other fancy styles ~
// there are many pre-defined style: "magic", "blueInk", "earlySpring", "frozenBerry", "gorgeousDream", "juicyCake", "lemonGate", "mint", "nearMoon", "octoberParty", "redBlue", "strawberry", "sunset"
controller.setStyle("strawberry");
controller.addData(data);
controller.init();
