(function( window, ProAct ) {
	'use strict';

  ProAct.Models = ProAct.Models || {};

  function Models(type, storage, initial) {
    this.type = type;
    this.storage = storage;

    var uuid = this.type.type ? this.type.type : this.type.uuid;
    if (this.storage) {
      this.storage.types[uuid] = this.type;
    }

    if (!initial) {
      initial = [];
    }

    ProAct.Array.apply(this, initial);

    this.storageListener = function (event) {
      var op    = event.args[0],
          ind   = event.args[1],
          ov    = event.args[2],
          nv    = event.args[3],
          ovs, nvs, i, ln,
          slice = Array.prototype.slice,
          operations = ProAct.Array.Operations;

      if (op === operations.set) {
        nv.save();
      } else if (op === operations.add) {
        nvs = slice.call(nv, 0);
        ln = nvs.length;

        for (i = 0; i < ln; i++) {
          nvs[i].save();
        }
      } else if (op === operations.remove) {
        ov.destroy();
      } else if (op === operations.setLength) {
        // TODO should be imposible to do that
      } else if (op === operations.splice) {
        nvs = slice.call(nv, 0);
        ln = nvs.length;

        for (i = 0; i < ln; i++) {
          nvs[i].save();
        }

        ovs = slice.call(ov, 0);
        ln = ovs.length;

        for (i = 0; i < ln; i++) {
          ovs[i].destroy();
        }
      }
    };

    this.core.on(this.storageListener);
  };

  Models.prototype = ProAct.Utils.ex(Object.create(ProAct.Array.prototype), {
    constructor: Models,

    makeModelListener: function () {
      if (!this.modelListener) {
        var self = this, listener = this.core.makeListener();
        this.modelListener = function () {
          self.core.off(self.storageListener);
          listener.call.apply(null, arguments);
          self.core.on(self.storageListener);
        };
      }

      return this.modelListener;
    },

    load: function(query) {
      ProAct.Storage.currentCaller = this.makeModelListener();
      try {
        this.core.off(this.storageListener);
        var uuid = this.type.type ? this.type.type : this.type.uuid;

        if (this._array.length > 0) {
          this.splice(0, this._array.length, this.storage.read(uuid, query));
        } else {
          ProAct.Array.prototype.push.apply(this, this.storage.read(uuid, query));
        }
      } finally {
        this.core.on(this.storageListener);
        ProAct.Storage.currentCaller = null;
      }
    }
  });

  ProAct.Models.create = function (type, storage) {
    return new Models(type, storage, Array.prototype.slice.call(arguments, 2));
  };

})( window, ProAct );
