(function( window, ProAct ) {
  'use strict';
  var def = ProAct.DSL.defPredefined;

  def('filter', 'enter', function (event) {
    return event.keyCode === 13;
  });

  def('filter', 'esc', function (event) {
    return event.keyCode === 27;
  });

  def('filter', 'notEmpty', function (val) {
    return !!val && val.length > 0;
  });

  def('filter', 'empty', function (val) {
    return !val || val.length === 0;
  });

  def('map', 'inputVal', function (event) {
    return $(event.target).prop('value');
  });

  def('map', 'trim', function (val) {
    return val.trim();
  });

})( window, ProAct );

