const addTaskForm = document.getElementById("add-task-form");
const todoList = document.getElementById("todo-list");

(() => {
    console.log("Initializing...");

    let todosData = JSON.parse(localStorage.getItem('todos') || '{}'); // Initialize with empty object if `todos` is absent

    if (!todosData.hasOwnProperty('todos')) {
        todosData = {todos: []};
        localStorage.setItem('todos', JSON.stringify(todosData));
    }

    todosData.todos.forEach(todo => {
        showTask(todo.id, todo.status, todo.content)
    });
})();

class todo {
    constructor(id, status, content) {
        this.id = id;
        this.status = status;
        this.content = content;
    }

    save() {
        const todosData = JSON.parse(localStorage.getItem('todos') || '{}');
        todosData.todos.push(this);
        localStorage.setItem('todos', JSON.stringify(todosData));
    }

    static remove(id) {
        let todosData = JSON.parse(localStorage.getItem('todos'));
        todosData.todos = todosData.todos.filter(todo => todo.id !== id);
        localStorage.setItem('todos', JSON.stringify(todosData));
    }

    static update(id, newStatus, newContent) {
        let todosData = JSON.parse(localStorage.getItem('todos'));
        const index = todosData.todos.findIndex(todo => todo.id === id);

        if (index !== -1) {
            todosData.todos[index].status = newStatus;
            todosData.todos[index].content = newContent;
            localStorage.setItem('todos', JSON.stringify(todosData));
        } else {
            console.warn(`Todo with ID ${id} not found for update.`);
        }
    }
}

// trigger when click add new task or enter
addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("Click [Add task]");

    let newTask = document.getElementById("new-task");

    if (newTask.value === "") {
        alert('Task is empty, you must type somethings');
        return;
    }
    let id = `task-${Date.now()}`;
    showTask(id, false, newTask.value);
    new todo(id, false, newTask.value).save();

    reset(newTask);
});

function reset(HtmlElement) {
    HtmlElement.value = "";
}

function showTask(id, status, content) {
    const newRow = document.createElement('tr');
    newRow.id = id;

    // Create table cells for checkbox, content, and actions
    const checkboxCell = document.createElement('td');
    checkboxCell.classList.add('border', 'border-slate-700', 'flex', 'items-center', 'justify-center');
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxInput.checked = status;
    checkboxInput.onchange = () => updateStatus(id)
    checkboxCell.appendChild(checkboxInput);

    const contentCell = document.createElement('td');
    contentCell.classList.add('border', 'border-slate-700', 'pl-2');
    contentCell.textContent = content;

    const actionsCell = document.createElement('td');
    actionsCell.classList.add('border', 'border-slate-700', 'flex', 'items-center', 'justify-center');
    const editIcon = document.createElement('span');
    editIcon.classList.add('material-symbols-outlined');
    editIcon.dataset.taskId = id; // Store task ID for edit functionality
    editIcon.onclick = () => editTask(id); // Call editTask function
    editIcon.textContent = 'edit';
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-symbols-outlined');
    deleteIcon.dataset.taskId = id; // Store task ID for delete functionality
    deleteIcon.onclick = () => deleteTask(id); // Call deleteTask function
    deleteIcon.textContent = 'delete';
    actionsCell.appendChild(editIcon);
    actionsCell.appendChild(deleteIcon);

    // Append cells to the new row and add the row to the table
    newRow.appendChild(checkboxCell);
    newRow.appendChild(contentCell);
    newRow.appendChild(actionsCell);
    todoList.appendChild(newRow);
}

function editTask(id) {
    const taskElement = document.getElementById(id);
    const contentCell = taskElement.querySelector('.pl-2');

    contentCell.contentEditable = true;
    contentCell.focus(); // Set focus for immediate editing

    taskElement.classList.add('editing');

    contentCell.addEventListener('blur', () => {
        contentCell.textContent = contentCell.textContent.trim();
        contentCell.contentEditable = false;
        taskElement.classList.remove('editing');

        let status = document
            .getElementById(id)
            .querySelector('input[type=checkbox]').checked;

        todo.update(id, status, contentCell.textContent)
    });
}

function updateStatus(id) {
    const taskElement = document.getElementById(id);
    const contentCell = taskElement.querySelector('.pl-2');

    let status = document
        .getElementById(id)
        .querySelector('input[type=checkbox]').checked;

    todo.update(id, status, contentCell.textContent)
}

function deleteTask(id) {
    const confirmation = confirm('Are you sure you want to delete this task?');
    if (confirmation) {
        const taskElement = document.getElementById(id);
        taskElement.parentNode.removeChild(taskElement);

        todo.remove(id);
    }
}

