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

  /**
   * Generate a random id in hex
   *
   * @return {String}
   */
  function generateId() {
    return crypto.randomBytes(5).toString('hex');
  }

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
      var todoid = generateId();
      var output = {
        todoid: todoid
      };
      todoList.push(output);
      return output;
    },

    /**
     * Create a new task with a unique id
     *
     * @return {Object}
     */
    createTask: function(todoid, text) {
      var todo = todoapp.getTodo(todoid);
      if (todo) {
        var task = {
          taskid: generateId(),
          complete: false,
          text: text
        };
        todo.tasks = todo.tasks || [];
        todo.tasks.push(task);
        return task;
      }
    },

    /**
     * Update the tasks' text
     *
     * @return {Object}
     */
    updateTaskText: function(todoid, taskid, text) {
      var todo = todoapp.getTodo(todoid);
      if (todo) {
        var task = todo.tasks.filter(function(o) {
          return o.taskid === taskid;
        });
        if (task.length === 1) {
          task[0].text = text;
          return task;
        }
      }
    },

    /**
     * Delete a task, returns false if not found
     *
     * @return {Boolean}
     */
    deleteTodo: function(todoid) {
      //todoList = todoList.filter(function(o) { o.todoid !== todoid });
      var index = -1;
      for (var i=0 ; i<todoList.length ; i++) {
        if (todoList[i] === todoid) {
          index = i;
        }
      }
      if (index >= 0) {
        todoList.splice(i, 1);
      }
      return index >= 0;
    }
  };

  return todoapp;
};

module.exports = TodoApp;
