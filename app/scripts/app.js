'use strict';

angular.module('todo', [
  'ngResource',
  'ngRoute'
])
.config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $routeProvider
    .when('/:todoid', {
      templateUrl: 'views/todo.html',
      controller: 'TodoCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
})
.controller('MainCtrl', function($scope, $routeParams, TodoService, $location) {
  $scope.search = function(searchText) {
    $scope.searchResults = TodoService.get({search: searchText});
  };

  $scope.createTodo = function() {
    TodoService.save({}, function(res) {
      console.log('Created new todo', res.todoid);
      $location.url('/' + res.todoid);
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
})
.factory('TodoService', function($resource) {
  return $resource('/todos/:todoid');
})
.factory('TaskService', function($resource) {
  return $resource('/todos/:todoid/tasks/:taskid');
});
