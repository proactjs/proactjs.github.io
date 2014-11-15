(function( window, $, ProAct ) {
  'use strict';

  ProAct.NewView = ProAct.NewView || ProAct.View.extend({
    type: 'new-view',
    shouldCreate: false
  });

  ProAct.Utils.ex(ProAct.NewView.prototype, {
    constructor: ProAct.NewView,

    doRender: function ($el) {
    },

    bindModel: function (model) {
      ProAct.View.prototype.bindModel.call(this, model);

      var view = this,
          props = this.model.__pro__.properties,
          initialModel = {},
          prop, property;

      for (prop in props) {
        property = props[prop];
        if (property.type() !== ProAct.Property.Types.auto) {
          initialModel[prop] = property.val;
        }
      }

      this.p('shouldCreate').on(function (e) {
        if (view.shouldCreate) {
          var model = view.model,
              prop, property,
              newModel = model.constructor.create(
                P.U.ex({}, initialModel),
                model.storage
              );

          ProAct.flow.pause();
          view.shouldCreate = false;
          ProAct.flow.resume();

          for (prop in initialModel) {
            newModel[prop] = model[prop];
            model[prop] = initialModel[prop];
          }

          newModel.save();
        }
      });
    }
  });
})(window, $, ProAct);
