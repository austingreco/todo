var http = require('http');
var should = require('should');
//var assert = require('assert');
var request = require('supertest');
var app = require('../server').app;

describe('Todo App REST API', function() {
  request = request('http://localhost:3000');

  describe('Todos', function() {
    var todoid;
    var taskid;

    it('should create a new todo', function(done) {
      request
      .post('/todos')
      .send({title: 'Test title'})
      .expect(201)
      .expect('Location', /todos/)
      .end(function(err, res) {
        res.body.should.have.property('todoid');
        res.body.should.have.property('title', 'Test title');
        todoid = res.body.todoid;
        done();
      });
    });

    it('should get all todos', function(done) {
      request
      .get('/todos')
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('todos');
        done();
      });
    });

    it('should create a new task', function(done) {
      request
      .post('/todos/' + todoid + '/tasks')
      .send({text: 'do something'})
      .expect(201)
      .expect('Location', /tasks/)
      .end(function(err, res) {
        res.body.should.have.property('taskid');
        res.body.should.have.property('text', 'do something');
        taskid = res.body.taskid;
        done();
      });
    });

    it('should edit a tasks text', function(done) {
      request
      .post('/todos/' + todoid + '/tasks/' + taskid)
      .send({text: 'updated text'})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('text', 'updated text');
        done();
      });
    });

    it('should not allow text which is too long', function(done) {
      request
      .post('/todos/' + todoid + '/tasks/' + taskid)
      .send({text: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'})
      .expect(400)
      .end(function(err, res) {
        done();
      });
    });

    it('should mark a task complete', function(done) {
      request
      .post('/todos/' + todoid + '/tasks/' + taskid)
      .send({complete: true})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('complete', true);
        done();
      });
    });

    it('should mark a task complete with truthy values', function(done) {
      request
      .post('/todos/' + todoid + '/tasks/' + taskid)
      .send({complete: 7})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('complete', true);
        done();
      });
    });

    it('should mark a task not complete', function(done) {
      request
      .post('/todos/' + todoid + '/tasks/' + taskid)
      .send({complete: false})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('complete', false);
        done();
      });
    });

    it('should search todos by title', function(done) {
      request
      .get('/todos')
      .query({search: 'Test'})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('todos').with.length(1);
        res.body.todos[0].should.have.property('title', 'Test title');
        done();
      });
    });

    it('should search todos for task by text', function(done) {
      request
      .get('/todos')
      .query({search: 'updated'})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('todos').with.length(1);
        res.body.todos[0].should.have.property('title', 'Test title');
        done();
      });
    });

    it('should have empty search results', function(done) {
      request
      .get('/todos')
      .query({search: 'zyzyzyzy'})
      .expect(200)
      .end(function(err, res) {
        res.body.should.have.property('todos').with.length(0);
        done();
      });
    });

    it('should delete a task', function(done) {
      request
      .delete('/todos/' + todoid + '/tasks/' + taskid)
      .expect(204)
      .end(function(err, res) {
        done();
      });
    });

    it('should not be able to edit a deleted task', function(done) {
      request
      .post('/todos/' + todoid + '/tasks/' + taskid)
      .send({completed: true})
      .expect(404)
      .end(function(err, res) {
        done();
      });
    });

    it('should fail delete an invalid task', function(done) {
      request
      .delete('/todos/' + todoid + '/tasks/abc')
      .expect(404)
      .end(function(err, res) {
        done();
      });
    });

    it('should delete a todo', function(done) {
      request
      .delete('/todos/' + todoid)
      .expect(204)
      .end(function(err, res) {
        done();
      });
    });

    it('should fail to delete an invalid todo', function(done) {
      request
      .delete('/todos/abc')
      .expect(404)
      .end(function(err, res) {
        done();
      });
    });

  });
});