'use strict';

describe('ProAct.View', function () {

  describe('bindings', function () {

    describe('checkbox', function () {
      var model, view;
      beforeEach(function () {
        $('body').append('<input id="test-checkbox" class="test-checkbox" type="checkbox" pro-bind="ok">');
        view = new ProAct.View({
          el: 'input',
          id: 'test-checkbox'
        });
        model = ProAct.prob({
          ok: true
        });
        view.render(model);
      });

      afterEach(function () {
        $('input#test-checkbox').remove();
      });

      it ('is set to its model value on init', function () {
        expect(view.$el.prop('checked')).toBe(true);
      });

      it ('changes on property change', function () {
        model.ok = false;
        expect(view.$el.prop('checked')).toBe(false);
      });

      it ('changes the model property on checkbox change', function () {
        view.$el.prop('checked', false).trigger('change');
        expect(model.ok).toBe(false);
      });
    });

    describe('text', function () {
      var model, view;
      beforeEach(function () {
        $('body').append($('<input id="test-text" class="test-text" pro-bind="txt">'));
        view = new ProAct.View({
          el: 'input',
          id: 'test-text'
        });
        model = ProAct.prob({
          txt: 'Test text.'
        });
        view.render(model);
      });

      afterEach(function () {
        $('input#test-text').remove();
      });

      it ('is set to its model value on init', function () {
        expect(view.$el.prop('value')).toEqual('Test text.');
      });

      it ('changes on property change', function () {
        model.txt = 'Some new text.';
        expect(view.$el.prop('value')).toEqual(model.txt);
      });

      it ('changes the model property on checkbox change', function () {
        view.$el.prop('value', 'Wow').trigger('keydown');
        expect(model.txt).toBe('Wow');
      });
    });

    describe('one way bindings', function () {
      var model, view;
      beforeEach(function () {
        $('body').append($('<input id="test-one-way-text" class="test-text" pro-bind="one-way:txt">'));
        view = new ProAct.View({
          el: 'input',
          id: 'test-one-way-text'
        });
        model = ProAct.prob({
          txt: 'Test text.'
        });
        view.render(model);
      });

      afterEach(function () {
        $('input#test-one-way-text').remove();
      });

      it ('is set to its model value on init', function () {
        expect(view.$el.prop('value')).toEqual('Test text.');
      });

      it ('changes on property change', function () {
        model.txt = 'Some new text.';
        expect(view.$el.prop('value')).toEqual(model.txt);
      });

      it ('changes the model property on checkbox change', function () {
        view.$el.prop('value', 'Wow').trigger('keydown');
        expect(model.txt).toNotBe('Wow');
      });
    });

    describe('simple element like span', function () {
      var model, view;
      beforeEach(function () {
        $('body').append('<span id="test-span" class="test-span" pro-bind="txt">');
        view = new ProAct.View({
          el: 'span',
          id: 'test-span'
        });
        model = ProAct.prob({
          txt: 'Test text.'
        });
        view.render(model);
      });

      afterEach(function () {
        $('span#test-span').remove();
      });

      it ('is set to its model value on init', function () {
        expect(view.$el.text()).toEqual('Test text.');
      });

      it ('changes on property change', function () {
        model.txt = 'Some new text.';
        expect(view.$el.text()).toEqual(model.txt);
      });
    });
  });

});
