(function( window, $, ProAct ) {
  'use strict';

  function setupPipes (context, pipeDefinitions) {
    var pipeData, pipeArgs,
        i, ln = pipeDefinitions.length;

    for (i = 0; i < ln; i++) {
      pipeData = pipeDefinitions[i];
      pipeArgs = pipeData.slice(3);
      ProAct.Streams.make(pipeData[0], pipeData[2], context, pipeData[1], pipeArgs);
    }
  }

  function setupActionStreams (context, $el, streamDefinitions) {
    var streamPath, action, $actionEl,
        streamData, i, ln;

    for (streamPath in streamDefinitions) {
      $actionEl = $el.find(streamPath)
      for (action in streamDefinitions[streamPath]) {
        streamData = streamDefinitions[streamPath][action];
        if (ProAct.Utils.isArray(streamData[0])) {
          ln = streamData.length;
          for (i = 0; i < ln; i++) {
            makeAction.apply(null, [context, $actionEl, action, streamPath].concat(streamData[i]));
          }
        } else {
          makeAction.apply(null, [context, $actionEl, action, streamPath].concat(streamData));
        }
      }
    }
  }

  function make (source, destination, context, meta, args, streamKey) {
    if (!meta) {
      meta = '';
    }
    if (!args) {
      args = [];
    }

    var ln = args.length;
    var currentArg = args.length;
    var destinationDsl;
    var stream;

    if (source) {
      currentArg += 1;
      if (P.U.isString(source)) {
        source = actorFromPath(context, source, null);
        // TODO Throw an error if source is not ProAct.Actor
      }

      meta = updateMeta(meta, '<<($' + currentArg + ')');
      args.push(source);
    }

    if (destination) {
      if (P.U.isString(destination)) {
        destination = actorFromPath(context, destination, null);
      }
      destinationDsl = P.U.isFunction(destination) ? '@' : '>>';

      currentArg += 1;
      meta = updateMeta(meta, destinationDsl + '($' + currentArg + ')');
      args.push(destination);
    }

    stream = setupStream(context, streamKey, meta, args);
    if (context && destination && P.U.isArray(destination)) {
      context.multyStreams[destinationName] = stream;
    }

    if (source) {
      source.update(source.makeEvent());
    }

    return stream;
  }

  function makeAction (context, $actionEl, action, path, streamData, propertyName) {
    var args = Array.prototype.slice.call(arguments, 5),
        stream, streamKey;

    if (action.indexOf('.') !== -1) {
      streamKey = (path + '-' + action).replace(/\./g, '-');
    }

    stream = make(null, propertyName, context, streamData, args, streamKey);

    $actionEl.on(action + '.' + context.id, function (e) {
      // TODO rename to proContext
      e.proView = context;
      stream.trigger(e);
    });

    return stream;
  }

  function setupStream (context, streamKey, streamData, args) {
    var key = streamKey ? streamKey : ProAct.Utils.uuid(),
        streamArgs = ['s:' + key, streamData],
        registry;

    if (args.length) {
      streamArgs = streamArgs.concat(args);
    }

    if (!(context && context.registry)) {
      registry = ProAct.registry;
    } else {
      registry = context.registry;
    }

    return registry.make.apply(registry, streamArgs);
  }

  function updateMeta(meta, metaFragment) {
    if (meta === '') {
      return metaFragment;
    }

    return meta + '|' + metaFragment;
  }

  function arrayFilter (context, array, filter, path) {
    return new ProAct.ArrayFilter(array, filter, context.registry, path);
  }

  function allArrayActors (context, actor, path) {
    return arrayFilter(context, actor, function () {return true;}, path);
  }

  function actorFromPath (context, path, obj) {
    var actor = obj ? obj : context; // The actor to read the actor path from.
    var i, paths = path.split('.'), ln = paths.length - 1; // Path is split to be iterated.
    var path, prev, method; // Helper vars.

    for (i = 0; i < ln; i++) {
      path = paths[i];

      // If the current path is '[]' -> it means the properties from the whole array.
      // So someArray[].stuff -> will retrieve an array of the all stuff actors.
      if (path === '[]') {
        return allArrayActors(context, actor, paths.slice(i + 1));
      // If the current path is '[filter]' -> the actor is a new ArrayFilter with the filter.
      } else if (path.charAt(0) === '[' && path.charAt(path.length - 1) === ']') {
        return arrayFilter(context, actor, path.substring(1, path.length - 1), paths.slice(i + 1).join('.'));
      }

      actor = actor[path];
    }

    // Last part of the path found - so and the last actor.
    path = paths[i];
    prev = actor;

    if (actor) {
      actor = actor.p(path);
    }

    // It is possible to have action instead of actor.
    // So the function is returned but bound to its context (which is actor).
    if (!actor && path.indexOf('do') === 0) {
      path = path.toLowerCase().substring(2);
      method = prev[path];
      if (method && P.U.isFunction(method)) {
        return P.U.bind(prev, method);
      }
    }

    // Same as the above but the action is part of the context's registered lambdas.
    if (!actor && path.indexOf('l:') === 0) {
      if (context) {
        method = context.regRead(path);
      } else {
        method = ProAct.registry.get(path);
      }

      if (method) {
        if (prev) {
          prev = prev[method] ? prev : context;

          return P.U.bind(prev, method);
        } else {
          return method;
        }
      }
    }

    // If the actor is an ArrayProperty -> we work with the array.
    if (actor.type && (actor.type() === ProAct.Property.Types.array)) {
      actor = actor.get().core;
    }

    // If the actor is an AutoProperty containing array -> we work with the array.
    if (actor.type && (actor.type() === ProAct.Property.Types.auto)) {
      if (P.U.isProArray(actor.get())) {
        actor = actor.get().core;
      }
    }

    // For ProxyProperties -> we work with the original
    while (actor.target) {
      actor = actor.target;
    }

    return actor;
  }

  ProAct.Streams = {
    make: make,
    makeAction: makeAction,
    setupPipes: setupPipes,
    setupActionStreams: setupActionStreams
  };

})( window, $, ProAct);
