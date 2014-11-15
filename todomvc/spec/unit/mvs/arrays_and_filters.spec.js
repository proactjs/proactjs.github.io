'use strict';

describe('ProAct.Array and ProAct.ArrayFilter integration.', function () {

  describe('ProAct.ArrayFilter', function () {
    describe('#constructor', function () {
      it ('sets a ProAct.Array filtered array, using the passed filter', function () {
        var filter = new ProAct.ArrayFilter([1, 2, 3], function (el) {
          return el % 2 === 0;
        });

        expect(filter.array).toNotBe(null);
        expect(P.U.isProArray(filter.array)).toBe(true);
        expect(filter.array.length).toBe(1);

        filter.original.push(4);
        expect(filter.array.length).toBe(2);
      });

      it ('if the passed filter is a string, it is interpreted as named lambda stored in the passed registry', function () {
        var registry = new ProAct.Registry().register('l', new P.R.FunctionProvider()),
            filter;
        registry.store('l:odd', function (el) {
          return el % 2 === 1;
        });

        filter = new ProAct.ArrayFilter([1, 2, 3], 'l:odd', registry);

        expect(filter.array).toNotBe(null);
        expect(P.U.isProArray(filter.array)).toBe(true);
        expect(filter.array.length).toBe(2);
      });

      it ('if the passed filter is a string, it is interpreted as named lambda stored in ProAct.registry, if no registry is passed', function () {
        ProAct.registry.store('l:odd', function (el) {
          return el % 2 === 1;
        });

        var filter = new ProAct.ArrayFilter([1, 2, 3], 'l:odd');

        expect(filter.array).toNotBe(null);
        expect(P.U.isProArray(filter.array)).toBe(true);
        expect(filter.array.length).toBe(2);
      });

      it ('if ProAct.Array nstance is passed as the original array, it can be used to mutate the filtering', function () {
        ProAct.registry.store('l:odd', function (el) {
          return el % 2 === 1;
        });

        var array = new ProAct.Array([1, 2]),
            filter = new ProAct.ArrayFilter(array, 'l:odd');

        expect(filter.array).toNotBe(null);
        expect(P.U.isProArray(filter.array)).toBe(true);
        expect(filter.array.length).toBe(1);

        array.push(3);
        expect(filter.array.length).toBe(2);
      });
    });

    describe('#makeListener', function () {
      it ('notifies only the filtered elements', function () {
        var m1 = ProAct.prob({num: 1, ping: false}),
            m2 = ProAct.prob({num: 2, ping: false}),
            m3 = ProAct.prob({num: 3, ping: false}),
            m4,
            array = [m1, m2, m3],
            fun = function (m) {
              return m.num % 2 === 0;
            },
            filter = new ProAct.ArrayFilter(array, fun, 'ping'),
            stream = new ProAct.Stream();

        expect(filter.array).toNotBe(null);
        expect(P.U.isProArray(filter.array)).toBe(true);
        expect(filter.array.length).toBe(1);

        // #makeListener result is set as listener of the stream
        stream.out(filter);

        stream.trigger(true);
        expect(m1.ping).toBe(false);
        expect(m2.ping).toBe(true);
        expect(m3.ping).toBe(false);

        m2.ping = false;
        m3.num = 4;

        stream.trigger(true);
        expect(m1.ping).toBe(false);
        expect(m2.ping).toBe(true);
        expect(m3.ping).toBe(true);

        m4 = ProAct.prob({num: 6, ping: false});
        array.push(m4);
        m2.num = 5;
        m2.ping = false;
        m3.ping = false;

        stream.trigger(true);
        expect(m1.ping).toBe(false);
        expect(m2.ping).toBe(false);
        expect(m3.ping).toBe(true);
        expect(m3.ping).toBe(true);
      });
    });
  });
});

