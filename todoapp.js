var crypto = require('crypto');

var TodoApp = function() {
  var todoList = [
    {
      todoid: 'ffffffff',
      tasks: [
        {
          taskid: 'fffffffe',
          complete: false,
          text: 'Make a test todo list'
        },
        {
          taskid: 'fffffffd',
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
    return crypto.randomBytes(4).toString('hex');
  }

  var todoapp = {
     /**
     * Check whether string is a valid id or not
     *
     * @return {Boolean}
     */
    isValidId: function(id) {
      return id && id.match(/^[a-f0-9]{8}$/)
    },

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
    getAllTodos: function(searchText) {
      if (searchText) {

      }
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
     * Delete a task, returns false if not found
     *
     * @return {Boolean}
     */
    deleteTodo: function(todoid) {
      //todoList = todoList.filter(function(o) { o.todoid !== todoid });
      var index = -1;
      for (var i=0 ; i<todoList.length ; i++) {
        if (todoList[i].todoid === todoid) {
          index = i;
        }
      }
      if (index >= 0) {
        todoList.splice(index, 1);
      }
      return index >= 0;
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
     * Create a new task with a unique id
     *
     * @return {Object}
     */
    deleteTask: function(todoid, taskid) {
      var todo = todoapp.getTodo(todoid);
      if (todo) {
        var index = -1;
        for (var i=0 ; i<todo.tasks.length ; i++) {
          if (todo.tasks[i].taskid === taskid) {
            index = i;
          }
        }
        if (index >= 0) {
          todo.tasks.splice(index, 1);
        }
        return index >= 0;
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
          return task[0];
        }
      }
    },

    /**
     * Update the tasks' completed status
     *
     * @return {Object}
     */
    updateTaskComplete: function(todoid, taskid, complete) {
      var todo = todoapp.getTodo(todoid);
      if (todo) {
        var task = todo.tasks.filter(function(o) {
          return o.taskid === taskid;
        });
        if (task.length === 1) {
          task[0].complete = complete;
          return task[0];
        }
      }
    }

  };

  return todoapp;
};

module.exports = TodoApp;
