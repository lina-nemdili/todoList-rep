
// Selectors
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('new-todo');
const todosContainer = document.getElementById('todos');

// Function to load todos from localStorage
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    todos.forEach(todo => {
        const todoItem = createTodoElement(todo.text, todo.completed);
        todosContainer.appendChild(todoItem);
    });
}

// Function to save todos to localStorage
function saveTodos() {
    const todoItems = todosContainer.querySelectorAll('.todo');

    const todos = [];
    todoItems.forEach(todoItem => {
        const todoText = todoItem.querySelector('.text').value;
        let completed;

        if (todoItem.classList.contains('done')) {
            completed = 'done';
        } else {
            completed = 'undone';
        }

        todos.push({ text: todoText, completed: completed });
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

// Event listener for form submission
todoForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const todoText = todoInput.value.trim(); // Get trimmed value of input

    if (todoText !== '') {
        const todoItem = createTodoElement(todoText, 'undone'); // New todos are initially 'undone'
        todosContainer.appendChild(todoItem);

        saveTodos(); // Save todos to localStorage
        todoInput.value = ''; // Clear input field
    }
});

// Event delegation for todo item actions
todosContainer.addEventListener('click', function(event) {
    const target = event.target;
    const todoItem = target.closest('.todo');

    if (!todoItem) return; // Exit if click is not on a todo item

    if (target.classList.contains('edit')) {
        // Toggle edit mode
        const textInput = todoItem.querySelector('.text');
        textInput.readOnly = !textInput.readOnly;

        if (!textInput.readOnly) {
            todoItem.classList.add('editing');
            target.textContent = 'Save'; // Change button text to 'Save'
        } else {
            todoItem.classList.remove('editing');
            target.textContent = 'Edit'; // Change button text back to 'Edit'
            saveTodos(); // Save todos to localStorage after editing
        }
    } else if (target.classList.contains('delete')) {
        // Delete todo item
        todoItem.remove();
        saveTodos(); // Save todos to localStorage after deletion
    } else if (target.classList.contains('checkbox')) {
        // Toggle todo completion
        if (target.checked) {
            todoItem.classList.add('done');
        } else {
            todoItem.classList.remove('done');
        }
        saveTodos(); // Save todos to localStorage after toggling completion
    }
});

// Function to create todo element
function createTodoElement(text, completed) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo');
    if (completed === 'done') {
        todoItem.classList.add('done');
    }

    // Todo content
    const todoContent = document.createElement('div');
    todoContent.classList.add('content');
    const todoCheckbox = document.createElement('input');
    todoCheckbox.setAttribute('type', 'checkbox');
    todoCheckbox.classList.add('checkbox');
    if (completed === 'done') {
        todoCheckbox.checked = true;
    }
    const todoTextInput = document.createElement('input');
    todoTextInput.setAttribute('type', 'text');
    todoTextInput.classList.add('text');
    todoTextInput.value = text;
    todoTextInput.readOnly = true; // Initially set as read-only
    todoContent.appendChild(todoCheckbox);
    todoContent.appendChild(todoTextInput);

    // Todo actions (edit and delete buttons)
    const todoActions = document.createElement('div');
    todoActions.classList.add('actions');
    const editButton = document.createElement('button');
    editButton.classList.add('edit');
    editButton.textContent = 'Edit';
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete');
    deleteButton.textContent = 'Delete';
    todoActions.appendChild(editButton);
    todoActions.appendChild(deleteButton);

    // Append content and actions to todo item
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoActions);

    return todoItem;
}

// Load todos from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTodos();
});
