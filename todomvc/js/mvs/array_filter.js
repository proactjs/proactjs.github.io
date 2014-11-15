(function( window, ProAct ) {
  'use strict';

  ProAct.ArrayFilter = function (array, filter, registry, propertyPath) {
    P.Actor.call(this);

    if (!P.U.isProArray(array)) {
      array = new ProAct.Array(array);
    }

    if (registry && P.U.isString(registry)) {
      propertyPath = registry;
      registry = null;
    }

    var filterFunc = filter;
    if (P.U.isString(filter)) {
      if (!registry && ProAct.registry) {
        registry = ProAct.registry;
      }
      filterFunc = registry.get(filter);

      if (!filterFunc && ProAct.registry) {
        filterFunc = ProAct.registry.get(filter);
      }
    }

    this.original = array;
    this.array = array.filter(filterFunc);
    this.propertyPath = propertyPath;
  };

  ProAct.ArrayFilter.prototype = P.U.ex(Object.create(P.Actor.prototype), {
    constructor: ProAct.ArrayFilter,

    makeEvent: function (source) {
      return source;
    },

    makeListener: function () {
      if (!this.listener) {
        var filter = this;
        this.listener = function (event) {
          var propertyPath = filter.propertyPath;
          filter.listeners.change = [];
          filter.array._array.forEach(function (el) {
            if (propertyPath && el.__pro__ && el.p(propertyPath)) {
              filter.on(el.p(propertyPath).makeListener());
            } else if (el.makeListener) {
              filter.on(el.makeListener());
            }
          });

          filter.update(event);
          filter.listeners.change = [];
        };
      }

      return this.listener;
    }
  });
})( window, ProAct );
