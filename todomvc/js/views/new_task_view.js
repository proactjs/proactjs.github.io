(function(window, ProAct) {
	'use strict';

  window.app = window.app || {};

  var NewTaskView = ProAct.NewView.extend({
    el: 'header',
    id: 'header',
    streams: {
      'input#new-todo': {
        keydown: [
          ['filter(enter)|map(inputVal)|map(trim)', 'description'],
          ['filter(enter)|map(inputVal)|map(trim)|filter(notEmpty)|map(true)', 'shouldCreate']
        ]
      },
    }
  });

  window.app.NewTaskView = NewTaskView;
})(window, ProAct);
