'use strict';

describe('ProAct.Model', function () {
  describe('#create', function () {
    it ('creates a ProAct.js reactive object instance using the data passed.', function () {
      var instance = ProAct.Model.create({
        a: 1,
        b: 2,
        c: function () {
          return this.a + this.b;
        }
      });

      expect(instance.a).toBe(1);
      expect(instance.b).toBe(2);
      expect(instance.c).toBe(3);

      instance.a = 13;
      expect(instance.c).toBe(15);
    });
  });

  describe('#extend', function () {
    it ('creates a ProAct.Model sub-class, which when instanced creates a ProAct.js reactive object, with the data passed.', function () {
      var Student = ProAct.Model.extend({
        name: null,
        age: null,
        repr: function () {
          if (this.name && this.age) {
            return this.name + ' : ' + this.age;
          }

          return 'anonymous';
        }
      });

      var nobody = Student.create();

      expect(nobody.name).toBe(null);
      expect(nobody.age).toBe(null);
      expect(nobody.repr).toEqual('anonymous');
    });

    it ('creates a ProAct.Model sub-class, which when instanced creates a ProAct.js reactive object, with the data passed overridden by the data passed to #create.', function () {
      var Student = ProAct.Model.extend({
        name: null,
        age: null,
        repr: function () {
          if (this.name && this.age) {
            return this.name + ' : ' + this.age;
          }

          return 'anonymous';
        }
      });

      var nobody = Student.create({
        name: 'Dali',
        age: '1 month'
      });

      expect(nobody.name).toEqual('Dali');
      expect(nobody.age).toEqual('1 month');
      expect(nobody.repr).toEqual('Dali : 1 month');
    });
  });
});

