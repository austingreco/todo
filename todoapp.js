var crypto = require('crypto');

var TodoApp = function() {
  var todoList = [
    {
      todoid: 'ffffffffff',
      tasks: [
        {
          taskid: 'fffffffffe',
          complete: false,
          text: 'Make a test todo list'
        },
        {
          taskid: 'fffffffffd',
          complete: true,
          text: 'Make a sandwich'
        }
      ]
    }
  ];

  var todoapp = {
    /**
     * Get a todo by it's id
     *
     * @return {Object}
     */
    getTodo: function(id) {
      if (id) {
        var todo = todoList.filter(function(o) {
          return o.todoid === id;
        });
        if (todo.length === 1) {
          return todo[0];
        }
      }
      return {};
    },

    /**
     * Get all todos
     *
     * @return {Object}
     */
    getAllTodos: function() {
      return {
        todos: todoList.map(function(o) { return o.todoid; })
      };
    },

    /**
     * Create a new todo with a unique id
     *
     * @return {Object}
     */
    createTodo: function() {
      var todoid = crypto.randomBytes(5).toString('hex');
      var output = {
        todoid: todoid,
        tasks: []
      };
      todoList.push(output);
      return output;
    },

    /**
     * Create a new task with a unique id
     *
     * @return {Object}
     */
    createTask: function(todoid, taskText) {
      var todo = todoapp.getTodo(todoid);
      if (todo.todoid) {
        var taskid = crypto.randomBytes(5).toString('hex');
        todo.tasks.push({
          taskid: taskid,
          text: taskText
        });
      }
      return ;
    }
  };

  return todoapp;
};

module.exports = TodoApp;
