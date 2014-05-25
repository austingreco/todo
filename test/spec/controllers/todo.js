'use strict';

describe('Controller: TodoCtrl', function () {

  beforeEach(module('todo'));

  var TodoCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TodoCtrl = $controller('TodoCtrl', {
      $scope: scope
    });
  }));

  it('should default to filter all tasks', function () {
    expect(scope.filterName).toEqual('all');
  });
});
