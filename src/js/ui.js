class UI {
	constructor(todosManager) {
		this.addTodoInput = document.getElementById('add-todo');
		this.list = document.getElementById('list');
		this.toggleAllBtn = document.getElementById('toggle-all');
		this.toolTip = document.getElementById('tooltip');
		this.todosManager = todosManager;
		this.listFinished = document.getElementById('list-finished');
	}

	clearInput() {
		this.addTodoInput.value = '';
	}

	clearList() {
		this.list.innerHTML = '';
	}

	clearFinishedList() {
		this.listFinished.innerHTML = '';
	}

	checkIfDone() {
		// Checks if done and applies appropriate styles
		[
			...this.list.children
		].forEach(li => {
			if (li.querySelector(`#completed-${li.dataset.id}`)) {
				li.querySelector('.list-item__content').classList.add('done');
			}
		});
	}

	setTodoIconHTML(isDone, liId) {
		return `<i id="${!isDone
			? 'not-'
			: ''}completed-${liId}" class="far fa-${isDone
			? 'check-'
			: ''}circle btn btn--toggle-one"></i>`;
	}

	createListItemHTML(isDoneIcon, content, dateCreated, isEditState = false) {
		// If the li is in edit mode, insert inner HTML with text input
		if (isEditState) {
			return `
			<div class="list-item__left">
				<span class="hidden">${isDoneIcon}</span>
				<input class="list-item__input" type="text" value="${content}">
			</div>`;
		}

		// Regular li html
		return `
		<div class="list-item__left">
			${isDoneIcon}
			<div class="list-item__content">${content}</div>
		</div>
		<div class="list-item__right">
			<em class="list-item__date">${new Date(dateCreated).toDateString()}</em>
			<i class="fas fa-times btn btn--remove">
		</div>`;
	}

	attachListeners(li, todoId, isDone) {
		this.attachEditListener(li);
		this.attachRemoveBtnListener(li, todoId);
		this.attachToggleBtnListener(li, todoId, isDone);
	}

	attachRemoveBtnListener(li, todoId) {
		li.querySelector('.btn--remove').addEventListener('click', () => {
			this.todosManager.removeTodo(todoId);
			this.renderTodoList();
		});
	}

	attachToggleBtnListener(li, todoId, isDone) {
		li
			.querySelector(`#${!isDone ? 'not-' : ''}completed-${todoId}`)
			.addEventListener('click', () => {
				this.todosManager.toggleIsDone(todoId);
				this.renderTodoList();
			});
	}

	attachEditListener(li) {
		li
			.querySelector('.list-item__content')
			.addEventListener('dblclick', e => {
				this.editState(li.dataset.id);
			});

		li.querySelector('.list-item__date').addEventListener('dblclick', e => {
			this.editState(li.dataset.id);
		});
	}

	renderTodoList() {
		this.clearList();
		this.clearFinishedList();
		const todos = this.todosManager.todos;
		if (Object.keys(todos).length) {
			for (let prop in todos) {
				const todo = todos[prop];
				const todoLiElement = document.createElement('li');
				todoLiElement.dataset.id = todo._id;
				todoLiElement.classList.add('list-item');

				const isDoneIcon = this.setTodoIconHTML(
					todo.isDone,
					todoLiElement.dataset.id
				);

				todoLiElement.innerHTML = this.createListItemHTML(
					isDoneIcon,
					todo.content,
					todo.dateCreated
				);

				this.attachListeners(todoLiElement, todo._id, todo.isDone);

				if (!todo.isDone) {
					this.list.append(todoLiElement);
				} else {
					this.listFinished.append(todoLiElement);
				}

				this.toggleAllBtn.classList.remove('hidden');
				this.toolTip.classList.remove('hidden');
			}
		} else {
			this.toggleAllBtn.classList.add('hidden');
			this.toolTip.classList.add('hidden');
		}

		this.checkIfDone();
	}

	editState(liId) {
		const li = document.querySelector(`[data-id="${liId}"]`);
		li.classList.add('box-shadow-inset');
		const todos = this.todosManager.todos;

		for (let prop in todos) {
			const todo = todos[prop];
			if (todo._id === li.dataset.id) {
				// Is done icon
				const isDoneIcon = this.setTodoIconHTML(
					todo.isDone,
					li.dataset.id
				);

				// Adding input element to html
				li.innerHTML = this.createListItemHTML(
					isDoneIcon,
					todo.content,
					todo.dateCreatedtrue,
					true
				);

				const listItemInput = li.querySelector('input');

				// Focus event ran before cursor was created, so added a small timer to prevent that
				setTimeout(() => {
					listItemInput.focus();
				}, 0);
				// Moving selection cursor to the end of the text input when editing
				listItemInput.selectionStart = listItemInput.selectionEnd = 10000;

				// Checking for enter key press to submit edit
				listItemInput.addEventListener('keydown', e => {
					if (e.keyCode === 13 && e.target.value) {
						li.innerHTML = this.createListItemHTML(
							isDoneIcon,
							e.target.value,
							todo.dateCreated
						);

						li.classList.remove('box-shadow-inset');

						this.attachListeners(li, todo._id, todo.isDone);

						// Saving edit
						this.todosManager.editTodo(todo._id, e.target.value);

						// Exit focus state
						listItemInput.blur();

						this.checkIfDone();
					}
				});

				// Checking for exiting the focused state, if user exits focus state either save changes or keep existing value
				listItemInput.addEventListener('blur', e => {
					const content = e.target.value || todo.content;

					li.innerHTML = this.createListItemHTML(
						isDoneIcon,
						content,
						todo.dateCreated
					);

					li.classList.remove('box-shadow-inset');

					this.attachListeners(li, todo._id, todo.isDone);

					this.todosManager.editTodo(todo._id, content);

					this.checkIfDone();
				});
			}
		}
	}
}

export default UI;
