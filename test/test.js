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
    it('should create a new todo', function(done) {
      request(url)
      .post('/todos')
      .end(function(err, res) {
        res.should.have.status(201);
        done();
      });
    });

    it('should delete a new todo', function(done) {
      request(url)
      .delete('/todos/ffffffffff')
      .end(function(err, res) {
        res.should.have.status(200);
        done();
      });
    });
  });

  describe('Tasks', function() {
    it('should create a new task', function(done) {
      request(url)
      .post('/todos/ffffffffff/tasks')
      .end(function(err, res) {
        res.should.have.status(201);
        done();
      });
    });
  });
});