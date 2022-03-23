var container = document.getElementById( "globalArea" );
var controller = new GIO.Controller( container );
controller.addData( data );
controller.setHaloColor(0x0000ff);
controller.init();
   
$( "#enable" ).click( function () {
  // you can add a halo to globe using addHalo() API with the halo color, when a halo already exists, this API just update the halo color
  controller.addHalo(0xff0000);
} );

$( "#disable" ).click( function () {
  // you can use removeHalo() API to remove the halo from earth
  controller.removeHalo();
} );

$( "#change" ).click( function () {
  // you can use setHaloColor() API to change the halo color
  controller.setHaloColor(0x00ff00);
} );