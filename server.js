
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
 * Routes
 */
app.get('/todos', function(req, res) {
  res.json(todoapp.getAllTodos());
});

app.get('/todos/:todoid', function(req, res) {
  if (!req.params.todoid.match(/^[a-f0-9]{10}$/)) {
    throw {
      status: 400,
      message: 'id is invalid'
    };
  }

  var todo = todoapp.getTodo(req.params.todoid);

  if (!todo.todoid) {
    res.json(404, {error: 'not found'});
    return;
  }
  res.json(todo);
});


app.post('/todos', function(req, res) {
  var todo = todoapp.createTodo();
  res.setHeader('Location', '/todos/' + todo.todoid);
  res.json(201, todo);
});

app.post('/todos/:todoid/tasks', function(req, res) {
  var taskid = crypto.randomBytes(5).toString('hex');
  var output = {
    taskid: taskid
  };
//  todos.push(output);
  res.setHeader('Location', '/todos/' + req.params.todoid + '/tasks/' + taskid);
  res.json(201, output);
});


app.put('/todos/:taskid', function(req, res) {
  // update todo
});

app.delete('/todos/:todoid', function(req, res) {
  if (!req.params.todoid.match(/^[a-f0-9]{10}$/)) {
    res.json(400, {error: 'todoid is invalid'});
    return;
  }
  res.json({});
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
