'use strict';

describe('Todo App', function() {

  browser.get('/');

  it('should automatically redirect to / when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch('/');
  });

  describe('Main Page', function() {

    var ptor;

    beforeEach(function() {
      ptor = protractor.getInstance();
      browser.get('/');
    });

    it('should show a typeahead when searching', function() {
      element(by.input('searchText')).sendKeys('e');
      expect(ptor.isElementPresent(by.css('.typeahead'))).toBe(true);
    });

    it('should goto todolist when search item is selected', function() {
      element(by.input('searchText')).sendKeys('e\n');
      expect(ptor.isElementPresent(by.css('.task-list'))).toBe(true);
    });

    it('should render todos on the main page', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/All Todos/);
    });

  });

  describe('Todo List', function() {

    var ptor;

    beforeEach(function() {
      ptor = protractor.getInstance();
    });

    it('should create a new todo', function() {
      browser.get('/');

      var title = 'Test Todo Name';
      element(by.model('newTodoTitle')).sendKeys(title + '\n');
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(title);
    });

    it('should create a new task', function() {
      var taskText = 'test task text';
      element(by.model('newTaskText')).sendKeys(taskText + '\n');
      element.all(by.repeater('task in todo.tasks')).then(function(arr) {
        expect(arr[0].getText()).toMatch(taskText);
      });
    });

    it('should edit the task', function() {
      var taskText = 'edited task text';
      element.all(by.repeater('task in todo.tasks')).last().findElement(by.css('.task-text > span')).click()
      element(by.model('task.text')).sendKeys(taskText + '\n');
      element.all(by.repeater('task in todo.tasks')).then(function(arr) {
        expect(arr[0].getText()).toMatch(taskText);
      });
    });

    it('should mark a task complete', function() {
      var input = element.all(by.repeater('task in todo.tasks')).last().findElement(by.model('task.complete'));
      input.click();
      expect(input.getAttribute('checked')).toBeTruthy();
    });

    it('should mark a task not complete', function() {
      var input = element.all(by.repeater('task in todo.tasks')).last().findElement(by.model('task.complete'));
      input.click();
      expect(input.getAttribute('checked')).toBeFalsy();
    });

    it('should delete the task', function() {
      element.all(by.repeater('task in todo.tasks')).last().findElement(by.css('.task-rm')).click().then(function(arr) {
        expect(arr.length).toEqual(0);
      });
    });

    it('should delete the todo', function() {
      browser.get('/');

      element.all(by.repeater('todo in todos')).then(function(arr) {
        var count = arr.length;
        var list = element.all(by.repeater('todo in todos'));
        list.last().findElement(by.css('.task-rm')).click();
        list.then(function(arr) {
          expect(arr.length).toEqual(count - 1);
        });
      });

    });

  });
});