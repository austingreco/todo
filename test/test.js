var http = require('http');
var should = require('should');
//var assert = require('assert');
var request = require('supertest');
var app = require('../server').app;

describe('Todo App', function() {
  var url = 'http://localhost:3000';

  var server;
  before(function(done) {
    done();
  });

  describe('Todos', function() {
    var todoid;

    it('should create a new todo', function(done) {
      request(url)
      .post('/todos')
      .end(function(err, res) {
        res.should.have.status(201);
        res.body.should.have.property('todoid');
        todoid = res.body.todoid;
        done();
      });
    });

    describe('Tasks', function() {
      var taskid;

      it('should create a new task', function(done) {
        request(url)
        .post('/todos/' + todoid + '/tasks')
        .end(function(err, res) {
          res.should.have.status(201);
          res.body.should.have.property('taskid');
          taskid = res.body.taskid;
          done();
        });
      });

       it('should edit a tasks text', function(done) {
        request(url)
        .post('/todos/' + todoid + '/tasks/' + taskid)
        .send({text: 'updated text'})
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('text', 'updated text');
          done();
        });
      });

       it('should mark a task complete', function(done) {
        request(url)
        .post('/todos/' + todoid + '/tasks/' + taskid)
        .send({complete: true})
        .end(function(err, res) {
          res.should.have.status(200);
          res.body.should.have.property('complete', true);
          done();
        });
      });

      it('should delete a task', function(done) {
        request(url)
        .delete('/todos/' + todoid + '/tasks/' + taskid)
        .end(function(err, res) {
          res.should.have.status(204);
          done();
        });
      });

       it('should not be able to edit a deleted task', function(done) {
        request(url)
        .post('/todos/' + todoid + '/tasks/' + taskid)
        .send({completed: true})
        .end(function(err, res) {
          res.should.have.status(404);
          done();
        });
      });
    });

    it('should delete a todo', function(done) {
      request(url)
      .delete('/todos/' + todoid)
      .end(function(err, res) {
        res.should.have.status(204);
        done();
      });
    });

  });
});