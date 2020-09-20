const jsPath = './assets/js/'

$.getScript(`${jsPath}tooltipster.js`)

$.getScript(`${jsPath}collaspable.js`, function(){
  activateCollaspable()
})

$( ".gantt__row-bars li" ).draggable({ grid: [ 87, 46 ] });
// $( ".gantt__row-bars li" ).draggable({ snap: ".gantt__row-bars" });

