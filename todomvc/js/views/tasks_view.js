(function(window, ProAct) {
	'use strict';

  window.app = window.app || {};

  var TasksView = ProAct.Views.extend({
    el: 'section',
    id: 'todoapp',
    itemsEl: 'ul',
    itemsId: 'todo-list',
    childType: app.TaskView,
    doneAll: function () {
      var every =  this.models.every(this.regRead('l:done'));
      if (every && this.models.length === 0) {
        every = false;
      }
      return every;
    },
    completedItems: function () {
      return this.models.filter(function (item) {
        return item.done;
      }, null, true);
    },
    leftItems: function () {
      return this.models.filter(function (item) {
        return !item.done;
      }, null, true);
    },
    completed: function () {
      var ln = this.completedItems.length;
      return 'Clear completed (' + ln + ')';
    },
    left: function () {
      var ln = this.leftItems.length,
          text = (ln === 1) ? ' item left' : ' items left';
      return '<strong>' + ln + '</strong>' + text;
    },
    lambdas: {
      completedCountToClass: function (e) {
        if (e.target.length === 0) {
          return 'hidden';
        }

        return ProAct.Event.simple('array', 'del', 'hidden');
      },
      itemsCountToClass: function (e) {
        if (e.target.length === 0) {
          return 'hidden';
        }

        return ProAct.Event.simple('array', 'del', 'hidden');
      },
      done: function (model) {
        return model.done;
      },
      active: function (model) {
        return !model.done;
      },
      doneFilter: function (e) {
        if (e.args[2] === 'l:done') {
          return 'selected';
        }
        return ProAct.Event.simple('array', 'del', 'selected');
      },
      activeFilter: function (e) {
        if (e.args[2] === 'l:active') {
          return 'selected';
        }
        return ProAct.Event.simple('array', 'del', 'selected');
      },
      allFilter: function (e) {
        if (e.args[2] === 'l:truth') {
          return 'selected';
        }
        return ProAct.Event.simple('array', 'del', 'selected');
      },
      toggleAllValue: function (e) {
        return $(e.target).prop('checked');
      }
    },
    streams: {
      'button#clear-completed': {
        click: [
          ['map(true)', 'models.[l:done].shouldDestroy']
        ]
      },
      'input#toggle-all': {
        change: [
          ['map(l:toggleAllValue)', 'models.[l:truth].done']
        ]
      }
    },
    pipes: [
      ['completedItems', 'map(l:completedCountToClass)', 'btnCompletedClasses'],
      ['models', 'map(l:itemsCountToClass)', 'footerClass'],
      ['filter', 'map(l:doneFilter)', 'completedSelected'],
      ['filter', 'map(l:activeFilter)', 'activeSelected'],
      ['filter', 'map(l:allFilter)', 'allSelected']
    ]
  });

  window.app.TasksView = TasksView;
})(window, ProAct);

