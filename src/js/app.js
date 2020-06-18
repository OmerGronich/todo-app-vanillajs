import '../sass/main.scss';
import UI from './UI.js';
import Store from './LocalStorage.js';
import TodosManager from './TodosManager.js';

// init task manager class
const todosManager = new TodosManager(Store);

// init ui class
const ui = new UI(todosManager);

// Initializing app
document.addEventListener('DOMContentLoaded', () => {
	ui.renderTodoList();
});

// Submit todo event
ui.addTodoInput.addEventListener('keydown', e => {
	if (e.keyCode === 13) {
		todosManager.addTodo(e.target.value);
		ui.clearInput();
		ui.renderTodoList();
	}
});

// Toggle All
ui.toggleAllBtn.addEventListener('click', e => {
	todosManager.toggleAll();
	ui.renderTodoList();
});
