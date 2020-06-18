import { v4 as uuid } from 'uuid';

class TodosManager {
	constructor(Store) {
		this.Store = Store;
		this.todos = this.Store.getTodos();
		this.sortTodosByDate();
	}

	addTodo(content) {
		if (!content) {
			return;
		}
		const todo = {
			content,
			dateCreated : Date.now(),
			isDone      : false,
			_id         : uuid()
		};
		this.todos[todo._id] = todo;
		this.Store.saveTodos(this.todos);
	}

	editTodo(todoId, changedContent) {
		const todo = this.todos[todoId];

		todo.content = changedContent;

		this.Store.saveTodos(this.todos);
	}

	removeTodo(todoId) {
		delete this.todos[todoId];

		this.Store.saveTodos(this.todos);
	}

	toggleIsDone(todoId) {
		const todo = this.todos[todoId];
		todo.isDone = !todo.isDone;

		this.Store.saveTodos(this.todos);
	}

	toggleAll() {
		let areAllCompleted;
		for (let prop in this.todos) {
			const todo = this.todos[prop];
			if (!todo.isDone) {
				areAllCompleted = false;
				break;
			} else {
				areAllCompleted = true;
			}
		}

		for (let prop in this.todos) {
			const todo = this.todos[prop];
			todo.isDone = !areAllCompleted;
		}

		this.Store.saveTodos(this.todos);
	}

	sortTodosByDate() {
		const todosArray = [];

		for (let todoId in this.todos) {
			todosArray.push([
				todoId,
				this.todos[todoId]
			]);
		}

		todosArray.sort((a, b) => a[1].dateCreated - b[1].dateCreated);

		const sortedTodos = todosArray.reduce((obj, prop) => {
			obj[prop[0]] = prop[1];
			return obj;
		}, {});

		this.todos = sortedTodos;
	}
}

export default TodosManager;
