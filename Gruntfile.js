module.exports = function(grunt) {
  'use strict'

  grunt.loadNpmTasks('grunt-browser-sync');

  grunt.initConfig({
    browserSync: {
      bsFiles: {
          src : ['index.html', 'stylesheets/*.css', 'pages/*.html']
      },
      options: {
          server: {
              baseDir: "./"
          },
          injectChanges: false
      }
    }
  });
};

