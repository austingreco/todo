describe('Controller: TodoCtrl', function () {

  beforeEach(module('todo'));

  var TodoCtrl,
    scope,
    _$httpBackend_,
    _$routeParams_;

  var taskid = 'f7f7f7f7';

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$routeParams_) {
    var todoid = 'f6f6f6f6';

    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $routeParams = _$routeParams_;
    $routeParams.todoid = todoid;
    TodoCtrl = $controller('TodoCtrl', {
      $scope: scope
    });


    $httpBackend.expectGET('/todos/' + todoid).respond(200, {
      todoid: todoid,
      title: 'Hello',
      tasks: []
    });
  }));

  it('should default to filter all tasks', function () {
    expect(scope.filterName).toEqual('all');
  });

  it('should create a task', function () {
    var text = 'test text';
    var todoid = $routeParams.todoid;

    scope.addTask(text);
    $httpBackend.expectPOST('/todos/' + todoid + '/tasks', {
      text: text
    }).respond(201, {
      text: text,
      taskid: taskid
    });
    $httpBackend.flush();
    expect(scope.newTaskText).toBe('');
    expect(scope.todo.tasks.length).toBe(1);
  });

  it('should mark a task complete', function () {
    var text = 'text';
    var todoid = $routeParams.todoid;

    scope.$apply(function() {
      scope.todo = {
        tasks: [
          {
            taskid: taskid,
            complete: false
          }
        ]
      };
    });

    scope.completeTask(scope.todo.tasks[0]);
    $httpBackend.expectPOST('/todos/' + todoid + '/tasks/' + taskid).respond(200, {
      text: text,
      taskid: taskid,
      complete: true
    });
    $httpBackend.flush();
    expect(scope.todo.tasks[0].complete).toBe(true);
  });

  it('should mark a task not complete', function () {
    var text = 'text';
    var todoid = $routeParams.todoid;

    scope.$apply(function() {
      scope.todo = {
        tasks: [
          {
            taskid: taskid,
            complete: true
          }
        ]
      };
    });

    scope.completeTask(scope.todo.tasks[0]);
    $httpBackend.expectPOST('/todos/' + todoid + '/tasks/' + taskid).respond(200, {
      text: text,
      taskid: taskid,
      complete: false
    });
    $httpBackend.flush();
    expect(scope.todo.tasks[0].complete).toBe(false);
  });

  it('should delete a task', function () {
    var text = 'text';
    var todoid = $routeParams.todoid;

    scope.$apply(function() {
      scope.todo = {
        tasks: [
          {
            taskid: taskid,
            complete: false
          }
        ]
      };
    });

    scope.deleteTask(scope.todo.tasks[0]);
    $httpBackend.expectDELETE('/todos/' + todoid + '/tasks/' + taskid).respond(204);
    $httpBackend.flush();
    expect(scope.todo.tasks.length).toBe(0);
  });
});

describe('Controller: TodoListCtrl', function () {

  beforeEach(module('todo'));

  var TodoListCtrl,
    scope,
    $httpBackend,
    $location;

  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, _$location_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    TodoListCtrl = $controller('TodoListCtrl', {
      $scope: scope
    });

    $httpBackend.expectGET('/todos').respond(200, {
      todos: []
    });
  }));

  it('should create a todo', function () {
    var title = 'test title';
    var todoid = 'f8f8f8f8';

    scope.createTodo(title);
    $httpBackend.expectPOST('/todos', {
      title: title
    }).respond(201, {
      title: 'test title',
      todoid: todoid
    });
    $httpBackend.flush();
    expect(scope.newTodoTitle).toBe('');
    expect($location.path()).toBe('/' + todoid);
  });
});

