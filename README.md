# agreco-mashape-todo

## REST API

All ids are 8 character hex strings. eg: `b779d205`

### Todos

#### `GET /todos`

Get all todos

```
{
  "todos": [
    {
      "todoid": "f94ff6f9",
      "title": "Some Title",
      "tasks": []
    }
  ]
}
```

#### `GET /todos?search=str`

Search todos & tasks by some string. Will match titles of todos and text of tasks and return 

```
{
  "todos": [
    {
      "todoid": "f94ff6f9",
      "title": "Some Title",
      "tasks": []
    }
  ]
}
```

#### `POST /todos`

Create a new todo with a unique id

Request body:
```
{
  "title": "Some Title"
}
```

#### `DELETE /todos/{todoID}`

Delete todo with id `{todoID}`. Returns `204` on success.

### Tasks

#### `POST /todos/{todoID}/tasks`

Create a new task with a unique id and add it to the todo list `{todoID}`

#### `POST /todos/{todoID}/tasks/{taskID}`

Update a task's text or mark a task complete/not complete. 

*POST was used because it's a partial update, and didn't want to mess with JSON PATCH diffs.*

##### Parameters

Parameters are sent as a JSON object in the request body.

* `text` - `String` Update the task's text
* `complete` - `Boolean` Mark the task as complete / not complete

##### Examples 

Update a task's text:

JSON request body
```
{
  "text": "Some new task text"
}
```

Mark a task complete:

JSON request body
```
{
  "complete": true
}
```

#### `DELETE /todos/{todoID}/tasks/{taskID}`

Delete task with id {taskID}. Returns `204` on success.

## Usage

*Grunt is required (`npm install -g grunt-cli`) before running any tasks*

Run app

```
npm start
```

This will start the server on port `3000`.

#### Run tests

3 types of tests are done:

* Mocha
* Karma - client side unit tests
* Protractor - client side end-to-end tests

To run the tests

```
npm test
```

This will install all dependencies and run the grunt test task.

#### Development

Start the server as above `npm start`, then:

```
grunt serve
```

Loads the app in a browser window with livereload. Requests are proxied to the local server on port 3000.

#### Build for prod

```
grunt build
```

Builds angular app into production ready format:

* Concat scripts and css
* Add hash to filenames for caching

It places the build files into `dist/` for use by the node server.

## Other Notes

The list is prepopulated with 1 todo list with 5 tasks. Some of the unit tests take this in to account.

The angular unit tests are not complete, but show most of the functionality.

The app is deployed fully on ec2 at: http://todo.austingreco.com
