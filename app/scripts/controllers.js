'use strict';

angular.module('todo')
.controller('MainCtrl', function($scope, $routeParams, $location, $http) {

  $scope.$on('$typeahead.select', function(event, args) {
    $location.url('/' + args.todoid);
  });

  $scope.search = function(searchText) {
    // clicking a typeahead entry triggers search() with full object
    if (angular.isObject(searchText)) {
      searchText = searchText.title;
    }

    var config = {
      params: {
        search: searchText
      }
    };
    return $http.get('/todos', config).then(function(res) {
      angular.forEach(res.data.todos, function(o) {
        o.label = o.title;
      });
      return res.data.todos;
    });
  };
})
.controller('TodoListCtrl', function($scope, TodoService, $location) {
  TodoService.get(function(res) {
    $scope.todos = res.todos;
  });

  $scope.createTodo = function(title) {
    TodoService.save({title: title}, function(res) {
      $scope.newTodoTitle = '';
      $location.url('/' + res.todoid);
    });
  };

  $scope.deleteTodo = function(todo) {
    TodoService.delete({todoid: todo.todoid}, function() {
      $scope.todos.splice($scope.todos.indexOf(todo), 1);
    });
  };
})
.controller('TodoCtrl', function($scope, $routeParams, TaskService, TodoService) {
  $scope.todo = TodoService.get({todoid: $routeParams.todoid});

  $scope.addTask = function(text) {
    TaskService.save({todoid: $routeParams.todoid}, {text: text}, function(res) {
      $scope.newTaskText = '';
      $scope.todo.tasks.push(res);
    });
  };

  $scope.deleteTask = function(task) {
    TaskService.delete({todoid: $routeParams.todoid, taskid: task.taskid}, function() {
      for (var i=0 ; i<$scope.todo.tasks.length ; i++) {
        if ($scope.todo.tasks[i].taskid === task.taskid) {
          $scope.todo.tasks.splice(i, 1);
          break;
        }
      }
    });
  };

  $scope.completeTask = function(task) {
    TaskService.save({todoid: $routeParams.todoid, taskid: task.taskid}, {complete: !task.complete}, function(res) {
      task.complete = res.complete;
    });
  };

  $scope.editTask = function(task) {
    task.editing = true;
    task.prevText = task.text;
  };

  $scope.saveEdit = function(task) {
    if (task.editing) {
      task.editing = false;
      if (task.text === task.prevText) {
        return;
      }
      TaskService.save({todoid: $routeParams.todoid, taskid: task.taskid}, {text: task.text}, function(res) {
        task.text = res.text;
      });
    }
  };

  $scope.filterName = 'all';
  $scope.setTaskFilter = function(type) {
    $scope.filterName = type;
    var filter = {};
    if (type === 'active' || type === 'done') {
      filter = {complete: type === 'done'};
    }
    $scope.taskFilter = filter;
  };
});
