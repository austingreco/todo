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
});
