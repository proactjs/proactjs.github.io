(function( window, $, ProAct ) {
  'use strict';

  ProAct.registry.store('l:truth', function () {
    return true;
  });


  ProAct.Views = ProAct.Views || ProAct.View.extend({
    $itemsEl: null,
    children: {},
    filter: 'l:truth',
    template: null,
    type: 'views',
    childType: null,
    length: function () {
      return this.items.length;
    }
  });

  ProAct.Utils.ex(ProAct.Views.prototype, {
    constructor: ProAct.Views,

    bindModel: function (models) {
      if (!this.models) {
        this.models = models;

        ProAct.prob(this, {
          $el: 'noprop',
          $itemsEl: 'noprop',
          $parent: 'noprop',
          model: 'noprop',
          streams: 'noprop',
          pipes: 'noprop',
          lambdas: 'noprop',
          registry: 'noprop',
          template: 'noprop',
          children: 'noprop',
          childType: 'noprop',
          beforeRender: 'noprop',
          afterRender: 'noprop',
          multyStreams: 'noprop',
          p: {
            queueName: 'view'
          }
        });

        this.models.load();
        this.items = this.models.filter(this.regRead('l:truth'));

        this.p('filter').on(function (e) {
          e.args[0].items.core.filteringListener(e.args[0].regRead(e.args[2]));
        });
      }
    },

    addChildView: function (childModel) {
      if (!this.children[childModel.uuid()]) {
        var child = new this.childType({
              parentView: this
            }),
            stream, path, prop;

        child.render(childModel)
        this.children[childModel.uuid()] = child;
      }
    },

    doRender: function () {
      if (this.itemsEl && this.itemsId) {
        this.$itemsEl = $(this.itemsEl + '#' + this.itemsId);
      }
      var view = this,
          i, ln = this.items.length;

      for (i = 0; i < ln; i++) {
        this.addChildView(this.items[i]);
      }

      this.items.core.on(function (event) {
        var op    = event.args[0],
            ind   = event.args[1],
            ov    = event.args[2],
            nv    = event.args[3],
            ovs, nvs, i, ln,
            slice = Array.prototype.slice,
            operations = ProAct.Array.Operations;

        if (op === operations.add) {
          nvs = slice.call(nv, 0);
          ln = nvs.length;

          for (i = 0; i < ln; i++) {
            view.addChildView(nvs[i]);
          }
        } else if (op === operations.remove) {
          // TODO
        } else if (op === operations.splice) {

          if (ov) {
            ln = ov.length;

            for (i = 0; i < ln; i++) {
              view.children[ov[i].uuid()].destroy();
              delete view.children[ov[i].uuid()];
            }

            if (view.models._array.length < Object.keys(view.children).length) {
              for (i in view.children) {
                ov = view.children[i];
                if (ov.model.isDestroyed) {
                  ov.destroy();
                  delete view.children[i];
                }
              }
            }
          }

          if (nv) {
            nvs = slice.call(nv, 0);
            ln = nvs.length;

            for (i = 0; i < ln; i++) {
              view.addChildView(nvs[i]);
            }
          }
        }
      });
    },

    setFilter: function (filter) {
      if (filter) {
        if (P.U.isFunction(filter)) {
          this.items.core.filteringListener(filter);
        } else {
          this.filter = filter;
        }
      }
    }
  });

})(window, $, ProAct);
