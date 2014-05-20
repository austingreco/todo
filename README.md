# agreco-mashape-todo

## REST API

All ids are 8 character hex strings. eg: `b779d205`

### Todos

#### `GET /todos`

Get all todos

```
{
  "todos": []
}
```

#### `POST /todos`

Create a new todo with a unique id

#### `DELETE /todos/{todoID}`

Delete todo with id `{todoID}`

### Tasks

#### `POST /todos/{todoID}/tasks`

Create a new task with a unique id and add it to the todo list `{todoID}`

#### `POST /todos/{todoID}/tasks/{taskID}`

Update a task's text or mark a task complete/not complete.

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

Delete task with id {taskID}

## Usage

Run app

```
npm install && npm start
```

Run tests

```
npm install && npm test
```
