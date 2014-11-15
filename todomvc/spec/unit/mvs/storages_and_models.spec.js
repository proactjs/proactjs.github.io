'use strict';

describe('ProAct.Storage, ProAct.Model and ProAct.Models', function () {

  var Task;
  beforeEach(function() {
    Task = ProAct.Model.extend({
      done: false,
      description: '',
      text: function () {
        var result = '';

        if (this.done) {
          result += 'Done : ';
        } else {
          result += 'To be done : ';
        }

        result += this.description;

        return result;
      }
    });
    Task.type = 'Task';

  });

  describe('ProAct.MemStorage', function () {

    var storage;
    beforeEach(function() {
      storage = new ProAct.MemStorage();
    });

    it ('ProAct.Models collection can be loaded from it', function () {
      var task = Task.create({
            description: 'Feed Dally.'
          }, storage),
          tasks = ProAct.Models.create(Task, storage);

      expect(tasks.length).toBe(0);

      task.save();

      tasks.load();
      expect(tasks.length).toBe(1);
      expect(tasks[0]).toBe(task);
    });

    it ('Adding a model to a ProAct.Models collection updates the storage with it', function () {
      var task = Task.create({
            description: 'Feed Dally.'
          }, storage),
          tasks = ProAct.Models.create(Task, storage),
          tasks2 = ProAct.Models.create(Task, storage);

      expect(tasks.length).toBe(0);

      tasks.push(task);

      expect(tasks.length).toBe(1);
      expect(tasks[0]).toBe(task);
      expect(task.isSaved).toBe(true);

      tasks2.load();
      expect(tasks2.length).toBe(1);
      expect(tasks2[0]).toBe(task);
    });

    it ('Destroying a model contained in a collection removes it from the collection', function () {
      var task = Task.create({
            description: 'Feed Dally.'
          }, storage),
          tasks = ProAct.Models.create(Task, storage);

      expect(tasks.length).toBe(0);

      task.save();

      tasks.load();
      expect(tasks.length).toBe(1);

      task.destroy();
      expect(tasks.length).toBe(0);
    });
  });
});

