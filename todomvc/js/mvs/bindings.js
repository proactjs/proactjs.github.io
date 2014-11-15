(function( window, ProAct ) {
  'use strict';

  var bindings = [],
      defaultBinding = {
        onProp: function ($binding, view, property, safe) {
          safe ? $binding.html(view[property]) : $binding.text(view[property]);
        },
        onChange: ProAct.N
      },
      types = {
        bind: setupBinding
      };

  function addBinding (binding) {
    bindings.push(binding);
    return binding;
  }

  function prepBinding (binding) {
    bindings.unshift(binding);
    return binding;
  }

  function delBinding (binding) {
    ProAct.Utils.remove(bindings, binding);
  }

  function filterBinding ($binding) {
    var i, ln = bindings.length,
        tag = $binding.prop('tagName').toLowerCase(),
        binding;

    for (i = 0; i < ln; i++) {
      var binding = bindings[i];
      if (binding.filter($binding, tag)) {
        return binding;
      }
    }

    return defaultBinding;
  }

  function onProp ($binding, view, property, safe) {
    if (!view.p(property)) {
      return;
    }

    var binding = filterBinding($binding);
    view.p(property).on(function () {
      if ($binding.updating) {
        return;
      }

      binding.onProp($binding, view, property, safe);
    });

    // sync
    view.p(property).update();
  }

  function onChange ($binding, view, property) {
    if (!view.p(property)) {
      return;
    }

    var binding = filterBinding($binding);
    binding.onChange($binding, view, property);
  }

  function jqOn (binding, $binding, type, view, property) {
    $binding.on(type, function () {
      try {
        $binding.updating = true;
        binding.change($binding, view, property);
      } finally {
        $binding.updating = false;
      }
    });
  }

  function addInputBinding (bindingDefinition) {
    var binding = {
      filter: function ($binding, tag) {
        return tag === 'input' &&
          (bindingDefinition.type ?
           $binding.attr('type') === bindingDefinition.type : true);
      },
      onProp: function ($binding, view, property, safe) {
        $binding.prop(bindingDefinition.prop, view[property]);
      },
      change: function ($binding, view, property) {
        view[property] = $binding.prop(bindingDefinition.prop);
      },
      onChange: function ($binding, view, property) {
        jqOn(this, $binding, bindingDefinition.event, view, property);
      }
    };

    return addBinding(binding);
  }

  function setupBinding ($binding, view) {
    var property = $binding.attr('pro-bind'),
        tag = $binding.prop('tagName').toLowerCase(),
        oneWay = (tag !== 'input'),
        safe = false;

    if (property.substring(0, 7) === 'one-way') {
      property = property.substring(8);
      oneWay = true;
    }

    if (property.substring(0, 4) === 'safe') {
      property = property.substring(5);
      safe = true;
    }

    if (!view.p(property)) {
      return;
    }

    ProAct.Bindings.onProp($binding, view, property, safe);

    if (oneWay) {
      return;
    }

    ProAct.Bindings.onChange($binding, view, property);
  }

  function setupClasses(view) {
    if (view.classes === null) {
      view.classes = [];
    }
    view.classes.core.on(classesListener(view.$el));

    var $bindings = view.$el.find('[pro-class]');
    $bindings.each(function () {
      var $binding = $(this),
          property = $binding.attr('pro-class'),
          prop = view[property];

      if (!prop) {
        view.p().set(property, []);
        prop = view[property];
      }

      prop.core.on(classesListener($binding));
    });
  }

  function classesListener ($el) {
    return function (event) {
      var op    = event.args[0],
          ind   = event.args[1],
          ov    = event.args[2],
          nv    = event.args[3],
          nvs, i, ln,
          slice = Array.prototype.slice,
          operations = ProAct.Array.Operations;

      if (op === operations.add) {
        nvs = slice.call(nv, 0);
        ln = nvs.length;
        for (i = 0; i < ln; i++) {
          $el.addClass(nvs[i]);
        }
      } else if (op === operations.remove) {
        $el.removeClass(ov);
      } else if (op === operations.splice) {
        nvs = slice.call(nv, 0);
        ln = nvs.length;

        for (i = 0; i < ln; i++) {
          $el.addClass(nvs[i]);
        }

        ln = ov.length;

        for (i = 0; i < ln; i++) {
          $el.removeClass(ov[i]);
        }
      }
    };
  }

  function setup (view) {
    setupClasses(view);

    var $bindings, type;

    for (type in types) {
      $bindings = view.$el.find('[pro-' + type + ']')
                        .add(view.$el.filter('[pro-' + type + ']')),
      $bindings.each(function () {
        types[type].call(null, $(this), view);
      });
    }
  }

  function addBindingType (name, operation) {
    types[name] = operation;
  }

  ProAct.Bindings = {
    addBinding : addBinding,
    addInputBinding: addInputBinding,
    prepBinding : prepBinding,
    delBinding : delBinding,
    addBindingType: addBindingType,
    onProp : onProp,
    onChange : onChange,
    setup: setup
  };

})( window, ProAct );
