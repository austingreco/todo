'use strict';

angular.module('todo', [
  'ngResource',
  'ngRoute',
  'mgcrea.ngStrap'
])
.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/', {
      templateUrl: 'views/main.html',
      controller: 'TodoListCtrl'
    })
    .when('/:todoid', {
      templateUrl: 'views/todo.html',
      controller: 'TodoCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.controller('MainCtrl', function($scope, $routeParams, TodoService, $location, $http) {

  $scope.$on('$typeahead.select', function(event, args) {
    $location.url('/' + args);
  });

  $scope.search = function(searchText) {
    var config = {
      params: {
        search: searchText
      }
    };
    return $http.get('/todos', config).then(function(e) {
      return e.data.todos;
    });
  };

  $scope.createTodo = function(title) {
    TodoService.save({title: title}, function(res) {
      $scope.newTodoTitle = '';
      $location.url('/' + res.todoid);
    });
  };
})
.controller('TodoListCtrl', function($scope, TodoService) {
  $scope.todos = TodoService.get();
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

  $scope.filterName = 'all';
  $scope.setTaskFilter = function(type) {
    $scope.filterName = type;
    var filter = {};
    if (type === 'active' || type === 'done') {
      filter = {complete: type === 'done'};
    }
    $scope.taskFilter = filter;
  };
})
.factory('TodoService', function($resource) {
  return $resource('/todos/:todoid');
})
.factory('TaskService', function($resource) {
  return $resource('/todos/:todoid/tasks/:taskid');
});
