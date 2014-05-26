'use strict';

angular.module('todo')
.directive('todoFocus', function($timeout) {
  return {
    restrict: 'A',
    link: function(scope, el) {
      $timeout(function() {
        el[0].focus();
      }, 50);
    }
  };
});