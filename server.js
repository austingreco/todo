
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

function isValidId(id) {
  return id && id.match(/^[a-f0-9]{10}$/);
}

function validateId(id) {
  if (!isValidId(id)) {
    throw {
      status: 400,
      message: 'id is invalid'
    };
  }
}

/**
 * Express config
 */
app.use(bodyParser());
app.use(compress());

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('.html', require('jade').__express);
app.use('/public', express.static(__dirname + '/public'));
app.use('/views', express.static(__dirname + '/views'));
app.use(jade_browser('/public/templates.js', '**', {
  minify: true,
  maxAge: 1,
  root: __dirname + '/views'
}));

/**
 * Todo Routes
 */
app.get('/todos', function(req, res) {
  res.json(todoapp.getAllTodos());
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

app.post('/todos/:todoid/tasks/:taskid', function(req, res) {
  validateId(req.params.todoid);

  var task = todoapp.createTask(req.params.todoid, req.body.text);
  res.setHeader('Location', req.path + task.taskid);
  res.json(201, task);
});

app.delete('/todos/:todoid/tasks/:taskid', function(req, res) {
  validateId(req.params.todoid);
  validateId(req.params.taskid);

  todoapp.deleteTask(req.params.todoid, req.params.taskid);
  res.send(204);
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
