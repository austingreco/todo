var should = require('should');
var todoapp = require('../todoapp')();

describe('Todo App Unit Tests', function() {

  describe('Todos', function() {
    var todoid;
    var taskid;

    it('should create a todo', function() {
      var todo = todoapp.createTodo();
      todo.should.have.property('todoid');
      todoapp.isValidId(todo.todoid).should.be.ok;
      todoid = todo.todoid;
    });

    it('should get a todo', function() {
      var todos = todoapp.getTodo(todoid);
      todos.should.have.property('todoid');
    });

    it('should get all todos', function() {
      var todo = todoapp.getAllTodos();
      todo.should.have.property('todos').with.length(2);
    });

    it('should not get a non-existent todo', function() {
      var todo = todoapp.getTodo('aaaaaaaa');
      (todo === undefined).should.be.true;
    });

    it('should not get an invalid todo', function() {
      var todo = todoapp.getTodo('a');
      (todo === undefined).should.be.true;
    });

    it('should create a task', function() {
      var task = todoapp.createTask(todoid);

      task.should.have.property('taskid');
      todoapp.isValidId(task.taskid).should.be.ok;

      var todo = todoapp.getTodo(todoid);
      todo.should.have.property('tasks').with.length(1);
      taskid = task.taskid;
    });

    it('should edit a tasks text', function() {
      var task = todoapp.updateTaskText(todoid, taskid, 'new text');
      task.text.should.equal('new text');
    });

    it('should mark a task complete', function() {
      var task = todoapp.updateTaskComplete(todoid, taskid, true);
      task.complete.should.be.true;
    });

    it('should mark a task not complete', function() {
      var task = todoapp.updateTaskComplete(todoid, taskid, false);
      task.complete.should.be.false;
    });

    it('should delete a task', function() {
      todoapp.deleteTask(todoid, taskid);
      var todo = todoapp.getTodo(todoid);
      todo.should.have.property('tasks').with.length(0);
    });

    it('should delete a todo', function() {
      var todos = todoapp.getAllTodos();
      todos.should.have.property('todos').with.length(2);
      todoapp.deleteTodo(todoid);
      todos = todoapp.getAllTodos();
      todos.should.have.property('todos').with.length(1);
    });
  });
});
