/**
 * Module Dependencies
 */
var express = require('express');
var app = express();
var jade_browser = require('jade-browser');
var bodyParser = require('body-parser');
var compress = require('compression');
var crypto = require('crypto');
var todoapp = require('./todoapp')();


/**
 * Config vars
 */
var config = {
  PORT: 3000
};


/**
 * Express config
 */
app.use(bodyParser());
app.use(compress());

app.use('/', express.static(__dirname + '/dist'));

/**
 * Validation
 */
function validateId(id) {
  if (!todoapp.isValidId(id)) {
    throw {
      status: 400,
      message: 'id is invalid'
    };
  }
}

function validateText(text) {
  if (text.length > 60) {
    throw {
      status: 400,
      message: 'text is invalid'
    };
  }
}


/**
 * Todo Routes
 */
app.get('/todos', function(req, res) {
  var todos;
  if (req.query.search) {
    todos = todoapp.searchTodos(req.query.search);
  } else {
    todos = todoapp.getAllTodos();
  }
  res.json(todos);
});

app.get('/todos/:todoid', function(req, res) {
  validateId(req.params.todoid);

  var todo = todoapp.getTodo(req.params.todoid);

  if (!todo) {
    throw {
      status: 404,
      message: 'Todo not found'
    };
  }

  res.json(todo);
});

app.post('/todos', function(req, res) {
  var todo = todoapp.createTodo();
  res.setHeader('Location', req.path + '/' + todo.todoid);
  res.json(201, todo);
});

app.delete('/todos/:todoid', function(req, res) {
  validateId(req.params.todoid);

  todoapp.deleteTodo(req.params.todoid);
  res.send(204);
});


/**
 * Task Routes
 */
app.post('/todos/:todoid/tasks', function(req, res) {
  validateId(req.params.todoid);

  var task = todoapp.createTask(req.params.todoid, req.body.text);
  res.setHeader('Location', req.path + task.taskid);
  res.json(201, task);
});

// Using POST for partial update here. PUT should be a full update; keeping it simple so no JSON PATCH diff.
app.post('/todos/:todoid/tasks/:taskid', function(req, res) {
  validateId(req.params.todoid);
  validateId(req.params.taskid);

  var task;

  if (req.body.text) {
    validateText(req.body.text);
    task = todoapp.updateTaskText(req.params.todoid, req.params.taskid, req.body.text);
  }

  if (req.body.complete !== undefined) {
    task = todoapp.updateTaskComplete(req.params.todoid, req.params.taskid, !!req.body.complete);
  }

  if (!task) {
    throw {
      status: 404,
      message: 'Task not found'
    };
  }
  res.json(task);
});

app.delete('/todos/:todoid/tasks/:taskid', function(req, res) {
  validateId(req.params.todoid);
  validateId(req.params.taskid);

  todoapp.deleteTask(req.params.todoid, req.params.taskid);
  res.send(204);
});

app.get('/*', function(req, res) {
  res.render('index');
});

/**
 * Error handling
 */
app.use(function(err, req, res, next) {
  res.statusCode = err.status || 500;
  var msg = err.message || 'An unknown error has occurred';
  res.json({
    message: msg
  });
});


/**
 * Init server
 */
app.listen(config.PORT);
console.log('Server started on port: '  + config.PORT);
console.log('-----------------------------');
