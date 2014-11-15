(function( window, $, ProAct ) {
  'use strict';

  function Router (root) {
    if (!root && window.location.pathname) {
      root = window.location.pathname;
    }

    this.root = root ? '/' + this.normalize(root) : '/';
    this.routes = [];
  };

  Router.prototype = {
    constructor: Router,

    normalize: function (path) {
      return path
              .toString()
              .replace('#', '')
              .replace(/\/\/+/, '/')
              .replace(/\/$/, '')
              .replace(/^\//, '');
    },

    currentPath: function () {
      var path = this.normalize(
        window.decodeURI(
          window.location.pathname + window.location.hash
        )
      );

      path = path.replace(/\?(.*)$/, '');

      path = (this.root !== '/') ? path.replace(this.root, '') : path;

      return this.normalize(path);
    },

    route: function (path, handler) {
      if (P.U.isFunction(path)) {
        handler = path;
        path = '';
      }

      this.routes.push({
        path: path,
        handler: handler
      });

      return this;
    },

    match: function (path) {
      var realPath = path || this.currentPath(),
          i, ln = this.routes.length,
          route, match;
      realPath = realPath.substring(this.root.length - 1);

      for (i = 0; i < ln; i++) {
        route = this.routes[i];

        if ((realPath === '' || realPath === '/index.html') && route.path === '') {
          match = [''];
        } else if (route.path !== '') {
          match = realPath.match(route.path);
        }

        if (match) {
          match.shift();
          route.handler.apply(null, match);
          return this;
        }
      }

      return this;
    },

    start: function () {
      var self = this;
      $(window).on('hashchange', function() {
        self.match(self.currentPath());
      });

      this.match(this.currentPath());
    },

    navigate: function(path) {
      path = path ? path : '';

      window.history.pushState(null, null, this.root + this.normalize(path));
      return this;
    }
  };

  ProAct.Router = Router;
})( window, $, ProAct);
