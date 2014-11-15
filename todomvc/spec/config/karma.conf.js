module.exports = function(karma) {
  karma.set({
    basePath: '../..',
    frameworks: ['jasmine'],

    files: [
      'bower_components/todomvc-common/base.js',
      'bower_components/proact.js/dist/js/proact.min.js',
      'bower_components/zepto/zepto.js',
      'js/mvs/array_filter.js',
      'js/mvs/mixins.js',
      'js/mvs/storage.js',
      'js/mvs/model.js',
      'js/mvs/models.js',
      'js/mvs/view.js',
      'js/mvs/new_view.js',
      'js/mvs/views.js',
      'js/mvs/streams.js',
      'js/mvs/bindings.js',
      'js/mvs/bindings_definitions.js',
      'js/mvs/router.js',
      'js/models/task.js',
      'js/views/task_view.js',
      'js/views/new_task_view.js',
      'js/views/tasks_view.js',
      'js/app.js',
      'spec/spec_helper.js',
      'spec/unit/**/*.spec.js',
      'spec/integration/**/*.spec.js',
    ],

    browsers: ['PhantomJS'],
    captureTimeout: 5000,
    singleRun: true,
    reportSlowerThan: 500,

    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher'
    ]
  });
};

