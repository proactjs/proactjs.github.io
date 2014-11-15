(function(window, ProAct) {
	'use strict';

  ProAct.flow.errStream().onErr(function (e) {
    console.log(e);
  });

  window.app = window.app || {};
  var app = window.app;

  app.storage = new ProAct.LocalStorage();

  app.getTaskListView = function (filter) {
    if (!app.views) {
      app.views = new app.TasksView();
      app.models = ProAct.Models.create(app.Task, app.storage);
      app.views.render(app.models);

      app.newView = new app.NewTaskView();
      app.newView.render(app.Task.create({}, app.storage));
    }

    app.views.setFilter(filter);

    return app.views;
  };

  app.router = new ProAct.Router();
  app.router
    .route(function () {
      app.getTaskListView('l:truth');
    })
    .route(/completed/, function () {
      app.getTaskListView('l:done');
    })
    .route(/active/, function () {
      app.getTaskListView('l:active');
    }).start();

})(window, ProAct);
