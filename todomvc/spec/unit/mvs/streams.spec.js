'use strict';

describe('ProAct.Streams', function () {

  describe('.make', function () {
    var make = ProAct.Streams.make;

    it ('creates a pipe stream between two properties', function () {
      var obj = ProAct.prob({
        a: 1,
        b: 0
      }),
      pipe;

      pipe = make(obj.p('a'), obj.p('b'));

      expect(pipe).toNotBe(undefined);
      expect(pipe instanceof ProAct.Stream).toBe(true);

      obj.a = 5;
      expect(obj.b).toBe(5);
    });

    it ('creates a pipe stream between two properties with transformations', function () {
      var obj = ProAct.prob({
        a: 1,
        b: 0
      }),
      pipe;

      pipe = make(obj.p('a'), obj.p('b'), null, 'map($1)', [function (e) {
        return e.args[2] + 3;
      }]);

      expect(pipe).toNotBe(undefined);
      expect(pipe instanceof ProAct.Stream).toBe(true);

      obj.a = 5;
      expect(obj.b).toBe(8);
    });

    it ('creates a pipe stream between a property and function', function () {
      var obj = ProAct.prob({
        a: 1
      }),
      res = [],
      pipe;

      pipe = make(obj.p('a'), function (e) {
        res.push(e);
      });

      expect(pipe).toNotBe(undefined);
      expect(pipe instanceof ProAct.Stream).toBe(true);

      obj.a = 5;
      expect(res.length).toBe(2);
      expect(res[1]).toEqual(obj.p('a').makeEvent());
    });

    it ('creates a pipe stream between a property and stored lambda', function () {
      var obj = ProAct.prob({
        a: 1
      }),
      res = [],
      pipe;

      ProAct.registry.store('l:test', function (e) {
        res.push(e);
      });

      pipe = make(obj.p('a'), 'l:test');

      expect(pipe).toNotBe(undefined);
      expect(pipe instanceof ProAct.Stream).toBe(true);

      obj.a = 5;
      expect(res.length).toBe(2);
      expect(res[1]).toEqual(obj.p('a').makeEvent());
    });

    it ('creates a pipe stream between two properties using context and paths', function () {
      var obj = ProAct.prob({
        a: 1,
        b: {
          c: 0
        }
      }),
      pipe;

      pipe = make('a', 'b.c', obj);

      expect(pipe).toNotBe(undefined);
      expect(pipe instanceof ProAct.Stream).toBe(true);

      obj.a = 5;
      expect(obj.b.c).toBe(5);
    });

    describe('with view-like context', function () {
      var context;
      beforeEach(function () {
      var streamProvider = new P.R.StreamProvider(),
          functionProvider = new P.R.FunctionProvider(),
          proObjectProvider = new P.R.ProObjectProvider();

        context = ProAct.prob({
          a: 0,
          b: 1,
          c: null,
          d: [1, 2, 3],
          e: {
            a: 4,
            b: function () {
              return this.a * context.a;
            }
          },
          f: false,
          g: [
            {
              a: 3
            },
            {
              a: 4
            }
          ]
        });

        context.multyStreams = {};
        ProAct.Mixins.mixin(context, ProAct.Mixins.RegistryStore);
      });

      it ('creates a pipe with two properties using the paths and the context provided', function () {
        var pipe = make('a', 'e.a', context);

        expect(pipe).toNotBe(null);
        expect(pipe).toNotBe(undefined);
        expect(pipe instanceof ProAct.Stream).toBe(true);

        context.a = 5;
        expect(context.e.a).toBe(5);
      });

      it ('creates a pipe with property to all array elements', function () {
        var pipe = make('a', 'g.[].a', context);

        expect(pipe).toNotBe(null);
        expect(pipe).toNotBe(undefined);
        expect(pipe instanceof ProAct.Stream).toBe(true);

        context.a = 5;

        expect(context.g[0].a).toBe(5);
        expect(context.g[1].a).toBe(5);
      });

      it ('creates a pipe with property to filtered array elements', function () {
        context.reg().store('l:test', function (el) {
          return el.a % 2 === 1;
        });

        var pipe = make('a', 'g.[l:test].a', context);

        expect(pipe).toNotBe(null);
        expect(pipe).toNotBe(undefined);
        expect(pipe instanceof ProAct.Stream).toBe(true);

        expect(context.g[0].a).toBe(0);
        expect(context.g[1].a).toBe(4);

        context.g[1].a = 3;

        context.a = 5;
        expect(context.g[0].a).toBe(0);
        expect(context.g[1].a).toBe(5);
      });

      it ('creates a pipe with property to action', function () {
        var res = [];
        context.speak = function (e) {
          res.push(e);
        };
        var pipe = make('a', 'doSpeak', context);

        expect(pipe).toNotBe(null);
        expect(pipe).toNotBe(undefined);
        expect(pipe instanceof ProAct.Stream).toBe(true);

        expect(res.length).toBe(1);
      });

      it ('creates a pipe with property to lambda action', function () {
        var res = [];
        context.reg().store('l:test', function (e) {
          res.push(e);
        });
        var pipe = make('a', 'l:test', context);

        expect(pipe).toNotBe(null);
        expect(pipe).toNotBe(undefined);
        expect(pipe instanceof ProAct.Stream).toBe(true);

        expect(res.length).toBe(1);
      });
    });
  });
});

