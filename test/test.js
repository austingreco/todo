var http = require('http');
var should = require('should');
//var assert = require('assert');
var request = require('supertest');
var app = require('../server').app;

describe('Todo App', function() {
  request = request('http://localhost:3000');

  describe('Todos', function() {
    var todoid;
    var taskid;

    it('should create a new todo', function(done) {
      request
      .post('/todos')
      .expect(201)
      .expect('Location', /todos/)
      .end(function(err, res) {
        res.body.should.have.property('todoid');
        todoid = res.body.todoid;
        done();
      });
    });

    it('should create a new task', function(done) {
      request
      .post('/todos/' + todoid + '/tasks')
      .expect(201)
      .expect('Location', /tasks/)
      .end(function(err, res) {
        res.body.should.have.property('taskid');
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
      .send({text: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz'})
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