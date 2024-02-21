const addTaskForm = document.getElementById("add-task-form");
const todoList = document.getElementById("todo-list");

class todo {
    constructor(id, status, content) {
        this.id = id;
        this.status = status;
        this.content = content;
    }
}

addTaskForm.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log("Click [Add task]");

    let newTask = document.getElementById("new-task");
    // console.log(newTask.value);

    if (newTask.value === "") {
        alert('Task is empty, you must type somethings');
        return;
    }

    createNewTask(newTask.value, false);

    reset(newTask);
});

function reset(HtmlElement) {
    HtmlElement.value = "";
}

// value: [true, false]
function createCheckbox(value) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('mr-2');
    checkbox.checked = value;
    return checkbox;
}

function createNewTask(newTask, value) {
    // Create a new table row element
    const newRow = document.createElement('tr');
    newRow.id = `task-${Date.now()}`; // Generate unique ID

    // Create table cells for checkbox, content, and actions
    const checkboxCell = document.createElement('td');
    checkboxCell.classList.add('border', 'border-slate-700', 'flex', 'items-center', 'justify-center');
    const checkboxInput = document.createElement('input');
    checkboxInput.type = 'checkbox';
    checkboxCell.appendChild(checkboxInput);

    const contentCell = document.createElement('td');
    contentCell.classList.add('border', 'border-slate-700', 'pl-2');
    contentCell.textContent = newTask;

    const actionsCell = document.createElement('td');
    actionsCell.classList.add('border', 'border-slate-700', 'flex', 'items-center', 'justify-center');
    const editIcon = document.createElement('span');
    editIcon.classList.add('material-symbols-outlined');
    editIcon.dataset.taskId = newRow.id; // Store task ID for edit functionality
    editIcon.onclick = () => editTask(editIcon.dataset.taskId); // Call editTask function
    editIcon.textContent = 'edit';
    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('material-symbols-outlined');
    deleteIcon.dataset.taskId = newRow.id; // Store task ID for delete functionality
    deleteIcon.onclick = () => deleteTask(deleteIcon.dataset.taskId); // Call deleteTask function
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
    });
}

function deleteTask(id) {
    const confirmation = confirm('Are you sure you want to delete this task?');
    if (confirmation) {
        const taskElement = document.getElementById(id);
        taskElement.parentNode.removeChild(taskElement);
    }
}