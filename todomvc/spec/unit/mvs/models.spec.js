'use strict';

describe('ProAct.Models', function () {

  describe('.create', function () {
    it ('creates a new reactive collection of models', function () {
      var models = ProAct.Models.create(ProAct.Model, null, [ProAct.Model.create({
        a: 1,
        b: 2,
        c: function () {
          return this.a + this.b;
        }
      })]);

      expect(ProAct.Utils.isArrayObject(models)).toBe(true);
      expect(ProAct.Utils.isProArray(models)).toBe(true);
      expect(models.length).toBe(1);

      expect(ProAct.Utils.isProObject(models[0])).toBe(true);
      expect(models[0].c).toBe(3);
    });
  });
});

