// To Do List JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.querySelector('.add');
    const filterBtn = document.getElementById('filter-btn');
    const clearBtn = document.querySelector('.clear');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let filter = 'all'; // all, pending, completed

    // Load todos on page load
    renderTodos();

    // Add todo
    addBtn.addEventListener('click', addTodo);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Filter todos
    filterBtn.addEventListener('click', toggleFilter);

    // Clear all todos
    clearBtn.addEventListener('click', clearAllTodos);

    function addTodo() {
        const task = taskInput.value.trim();
        const date = dateInput.value;

        if (!task && !date) {
            alert('Please enter both task and date!');
            return;
        }

        if (!task) {
            alert('Please enter a task!');
            return;
        }

        if (!date) {
            alert('Please enter a date!');
            return;
        }

        const todo = {
            id: Date.now(),
            task: task,
            date: date,
            status: 'pending'
        };

        todos.push(todo);
        saveTodos();
        renderTodos();
        taskInput.value = '';
        dateInput.value = '';
    }

    function renderTodos() {
        todoList.innerHTML = '';

        const filteredTodos = todos.filter(todo => {
            if (filter === 'all') return true;
            return todo.status === filter;
        });

        filteredTodos.forEach(todo => {
            const row = document.createElement('tr');
            if (todo.status === 'completed') {
                row.className = 'completed';
            }

            const statusClass = todo.status === 'completed' ? 'completed' : 'pending';
            const statusText = todo.status === 'completed' ? 'Completed' : 'Pending';

            row.innerHTML = `
                <td>${todo.task}</td>
                <td>${todo.date || 'No date'}</td>
                <td><span class="status ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="item-actions">
                        <button class="btn edit" onclick="editTodo(${todo.id})">Edit</button>
                        <button class="btn ${todo.status === 'pending' ? 'complete' : 'delete'}" onclick="${todo.status === 'pending' ? 'completeTodo' : 'deleteTodo'}(${todo.id})">
                            ${todo.status === 'pending' ? 'Complete' : 'Delete'}
                        </button>
                    </div>
                </td>
            `;

            todoList.appendChild(row);
        });
    }

    function clearAllTodos() {
        if (confirm('Are you sure you want to delete all todos?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    }

    function toggleFilter() {
        if (filter === 'all') {
            filter = 'pending';
            filterBtn.textContent = 'Pending';
        } else if (filter === 'pending') {
            filter = 'completed';
            filterBtn.textContent = 'Completed';
        } else {
            filter = 'all';
            filterBtn.textContent = 'All';
        }
        renderTodos();
    }

    window.editTodo = function(id) {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const newTask = prompt('Edit task:', todo.task);
        if (newTask !== null && newTask.trim()) {
            todo.task = newTask.trim();
            saveTodos();
            renderTodos();
        }
    };

    window.completeTodo = function(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.status = 'completed';
            saveTodos();
            renderTodos();
        }
    };

    window.deleteTodo = function(id) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        renderTodos();
    };

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
});