(function(window, ProAct) {
	'use strict';

  window.app = window.app || {};

  var template = '<li id="test">' +
                  '<div class="view">' +
                    '<input class="toggle" type="checkbox" pro-bind="done">' +
                    '<label class="description" pro-bind="description">Rule the web</label>' +
                    '<button class="destroy"></button>' +
                  '</div>' +
                  '<input class="edit" value="Rule the web" pro-bind="one-way:description">' +
                '</li>';

  var TaskView = ProAct.View.extend({
    template: template,
    lambdas: {
      editing: function () {
        return 'editing';
      },
      isEditing: function (e) {
        if (e.proView) {
          return e.proView.classes._array.indexOf('editing') !== -1;
        }
        return e.target._array.indexOf('editing') !== -1;
      },
      isNotEditing: function (e) {
        return e.target._array.indexOf('editing') === -1;
      },
      complete: function (val) {
        if (val) {
          return 'completed';
        }

        return ProAct.Event.simple('array', 'del', 'completed');
      },
      focus: function () {
        this.$el.find('input.edit').focus();
      },
      restore: function () {
        this.$el.find('input.edit').val(this.description);
      }
    },
    streams: {
      'label.description': {
        dblclick: ['map(l:editing)', 'classes']
      },
      'input.edit': {
        keydown: [
          ['filter(enter)|map(inputVal)|map(trim)', 'description'],
          ['filter(enter)|map(pop)', 'classes'],
          ['filter(esc)|map(pop)', 'classes'],
          ['filter(enter)', 'model.doSave'],
          ['filter(enter)|map(inputVal)|map(trim)|filter(empty)|map(true)', 'model.shouldDestroy'],
        ],
        blur: [
          ['filter(l:isEditing)|map(inputVal)|map(trim)', 'description'],
          ['filter(l:isEditing)|map(pop)', 'classes']
        ]
      },
      'button.destroy': {
        'click.dst': ['map(true)', 'model.shouldDestroy']
      }
    },
    pipes: [
      ['done', 'map(eventToVal)|map(l:complete)', 'classes'],
      ['done', '', 'model.doSave'],
      ['classes', 'filter(l:isEditing)', 'l:focus'],
      ['classes', 'filter(l:isNotEditing)', 'l:restore'],
    ]
  });

  window.app.TaskView = TaskView;
})(window, ProAct);

