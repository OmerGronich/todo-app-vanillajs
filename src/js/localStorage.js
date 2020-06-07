class Store {
	static getTodos() {
		try {
			return localStorage['todoList']
				? JSON.parse(localStorage['todoList'])
				: {};
		} catch (e) {
			console.log('Error parsing todos from local storage', e);
			return {};
		}
	}

	static saveTodos(todos) {
		localStorage.setItem('todoList', JSON.stringify(todos));
	}
}

export default Store;
