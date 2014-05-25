'use strict';

angular.module('todo')
.factory('TodoService', function($resource) {
  return $resource('/todos/:todoid');
})
.factory('TaskService', function($resource) {
  return $resource('/todos/:todoid/tasks/:taskid');
});
