(function( window, ProAct ) {
	'use strict';

  ProAct.flow.addQueue('storage');

  ProAct.Storage = ProAct.Storage || function () {
    ProAct.Actor.call(this, 'storage');
  };
  ProAct.Storage.currentCaller = null;

  ProAct.Storage.prototype = ProAct.Utils.ex(Object.create(ProAct.Actor.prototype), {
    constructor: ProAct.Storage,

    makeEvent: function (e) {
      return e;
    },

	  defer: function (event, listener) {
	    if (listener.property) {
	      P.Actor.prototype.defer.call(this, event, listener);
	      return;
	    }
	
	    if (P.U.isFunction(listener)) {
	      P.flow.push(listener, [event]);
	    } else {
	      P.flow.push(listener, listener.call, [event]);
	    }
	  },

    create: function (model) {
      var store = this;
      ProAct.flow.run(function () {
        store.update(model, [model.constructor.type ? model.constructor.type : model.constructor.uuid]);

        model.isCreated = true;
        model.isSaved = true;
        model.isDestroyed = false;
      });

      return model;
    },
    save: function (model) {
      model.isSaved = true;
      return model;
    },
    read: function (uuid, query) {
      if (ProAct.Storage.currentCaller) {
        this.on(uuid, ProAct.Storage.currentCaller);
      }
    },
    destroy: function (model) {
      var store = this;

      ProAct.flow.run(function () {
        model.isCreated = false;
        model.isSaved = false;
        model.isDestroyed = true;

        store.update(ProAct.Event.simple('array', 'del', model), [model.constructor.type ? model.constructor.type : model.constructor.uuid]);
      });

      return model;
    },

    register: function (uuid, data) {}
  });

  ProAct.MemStorage = ProAct.MemStorage || function () {
    ProAct.Storage.call(this);

    this.store = {};
  };

  ProAct.MemStorage.prototype = ProAct.Utils.ex(Object.create(ProAct.Storage.prototype), {
    constructor: ProAct.MemStorage,

    create: function (model) {
      var uuid = model.constructor.type ? model.constructor.type : model.constructor.uuid,
          storage = this.register(uuid);

      storage.push(model);

      return ProAct.Storage.prototype.create.call(this, model);
    },

    destroy: function (model) {
      var uuid = model.constructor.type ? model.constructor.type : model.constructor.uuid,
          storage = this.register(uuid);

      ProAct.Utils.remove(storage, model);

      return ProAct.Storage.prototype.destroy.call(this, model);
    },

    read: function (uuid, query) {
      ProAct.Storage.prototype.read.call(this, uuid, query);

      var storage = this.register(uuid);

      return [].concat(storage);
    },

    register: function (uuid, data) {
      if (!this.store[uuid]) {
        this.store[uuid] = [];
      }

      return this.store[uuid];
    },

    types: {}
  });

  ProAct.LocalStorage = ProAct.LocalStorage || function () {
    ProAct.MemStorage.call(this);
  };

  ProAct.LocalStorage.prototype = ProAct.Utils.ex(Object.create(ProAct.MemStorage.prototype), {
    constructor: ProAct.LocalStorage,

    toSimpleModel: function (model) {
      var properties = model.p().properties,
          p, prop, res = {},
          systemProps = ['isDestroyed', 'isSaved', 'isCreated', 'shouldDestroy', 'shouldSave'];

      for (p in properties) {
        prop = properties[p];

        if (prop.type() !== ProAct.Property.Types.auto && systemProps.indexOf(p) === -1) {
          res[p] = prop.val;
        }
      }

      return res;
    },

    updateLocalStorage: function (uuid) {

      if (window.localStorage) {
        var self = this,
            storage = this.register(uuid),
            json = JSON.stringify(storage.map(function (model) {
              return self.toSimpleModel(model);
            }));
        localStorage.setItem(uuid, json);
      }
    },

    create: function (model) {
      ProAct.MemStorage.prototype.create.call(this, model);

      this.updateLocalStorage(model.constructor.type ? model.constructor.type : model.constructor.uuid);
      return model;
    },

    destroy: function (model) {
      ProAct.MemStorage.prototype.destroy.call(this, model);

      this.updateLocalStorage(model.constructor.type ? model.constructor.type : model.constructor.uuid);
      return model;
    },

    read: function (uuid, query) {
      if (!window.localStorage) {
        return ProAct.Storage.prototype.read.call(this, uuid, query);
      }

      ProAct.Storage.prototype.read.call(this, uuid, query);

      var self = this,
          json = window.localStorage.getItem(uuid),
          type = this.types[uuid],
          storage = this.register(uuid);

      if (!json || !type) {
        return storage;
      }

      storage = JSON.parse(json);

      this.store[uuid] = storage.map(function (model) {
        var typed = type.create(model, self);

        ProAct.flow.run(function () {
          typed.isCreated = true;
          typed.isSaved = true;
          typed.isDestroyed = false;
        });

        return typed;
      });

      return [].concat(this.store[uuid]);
    },

    save: function (model) {
      ProAct.MemStorage.prototype.save.call(this, model);

      this.updateLocalStorage(model.constructor.type ? model.constructor.type : model.constructor.uuid);
      return model;
    },
  });

})(window, ProAct);
