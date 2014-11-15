module.exports = function(grunt) {
  'use strict'

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    browserSync: {
      bsFiles: {
          src : ['index.html', 'css/*.css', 'js/*.js']
      },
      options: {
          server: {
              baseDir: "./"
          },
          injectChanges: false
      }
    },

    karma: {
      unit: {
        configFile: 'spec/config/karma.conf.js',
        keepalive: true
      }
    }
  });

  grunt.registerTask('spec', ['karma:unit']);

  grunt.registerTask('default', ['browserSync']);
};

