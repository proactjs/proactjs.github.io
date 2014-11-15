(function(window, ProAct) {
	'use strict';

  window.app = window.app || {};

  var Task = ProAct.Model.extend({
    done: false,
    description: ''
  });
  Task.type = 'Task';

  window.app.Task = Task;
})(window, ProAct);

