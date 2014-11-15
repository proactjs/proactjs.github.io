(function( window, $, ProAct ) {
  'use strict';

  var addInputBinding = ProAct.Bindings.addInputBinding;

  addInputBinding({
    type: 'checkbox',
    prop: 'checked',
    event: 'change'
  });

  addInputBinding({
    prop: 'value',
    event: 'keydown'
  });

})( window, $, ProAct);
