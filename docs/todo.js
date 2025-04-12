const username = localStorage.getItem('username');
document.getElementById('username').textContent = username.toUpperCase();
let currentPage = 1;
const limit = 10;
let isLoading = false;
let totalPages = null;


async function loadTasks() {
    if (isLoading || (totalPages && currentPage > totalPages)) return;

    isLoading = true;

    try {
        const token = localStorage.getItem('authToken');

        const res = await fetch(`https://todolist-6qfg.onrender.com/api/tasks/get?page=${currentPage}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.success) {
            totalPages = data.pagination.totalPages;

            data.tasks.forEach(task => {
                renderTask(task);
            });

            currentPage++;
        }
    } catch (error) {
        console.log("Error loading tasks", error);
    } finally {
        isLoading = false;
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loadTasks();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});

function renderTask(taskData) {
    const container = document.getElementById('tasksContainer');

    const task = document.createElement('div');
    task.className = 'task';
    task.setAttribute('data-id', taskData._id);

    task.innerHTML = `
        <div class="holder">
            <textarea class="text" maxlength="70" disabled>${taskData.task}</textarea>
            <button class="more"><b>...</b></button>
            <div class="buttons">
                <button class="status">${taskData.completed ? 'unfinish' : 'finish'}</button>
                <button class="edit" >edit</button>
                <button class="delete" >delete</button>
                <button class="save" style="display:none;">Save</button>
                <button class="cancel" style="display:none;">Cancel</button>
            </div>
        </div>
    `;

    const moreButton = task.querySelector('.more');
    const editButton = task.querySelector('.edit');
    const deleteButton = task.querySelector('.delete');
    const saveButton = task.querySelector('.save');
    const cancelButton = task.querySelector('.cancel');
    const finishButton = task.querySelector('.status');


    moreButton.addEventListener('click', function() {
        toggleButtons(moreButton);
    });

    editButton.addEventListener('click', function() {
        edit(editButton);
    });

    deleteButton.addEventListener('click', function () {
        deleteTask(deleteButton);
    });    

    saveButton.addEventListener('click', function() {
        save(saveButton);
    });

    cancelButton.addEventListener('click', function() {
        task.remove();
    });

    finishButton.addEventListener('click', function () {
        finish(finishButton);
    });


    if (taskData.completed) {
        task.querySelector('.text').style.textDecoration = 'line-through';
    }

    container.appendChild(task);
}

function toggleButtons(moreButton) {
    const holder = moreButton.parentElement;
    const buttons = holder.querySelector('.buttons');

    event.stopPropagation();

    if (moreButton.textContent === '...') {
        buttons.style.display = "flex";
        moreButton.textContent = '✖';
        return;
    }
    
    if (moreButton.textContent === '✖') {
        moreButton.innerHTML = '<b>...</b>';
        buttons.style.display = "none";
        return;
    }
}

document.addEventListener('click', function (event) {
    const taskElements = document.querySelectorAll('.task');
    
    taskElements.forEach(function(task) {
        const moreButton = task.querySelector('.more');
        const buttons = task.querySelector('.buttons');
        
        if (!task.contains(event.target) && moreButton.textContent === '✖') {
            moreButton.textContent = '...';
            buttons.style.display = "none";
        }
    });
});

async function addTask() {
    const container = document.getElementById('tasksContainer');

    const task = document.createElement('div');
    task.className = 'task';

    task.innerHTML = `
        <div class="holder">
            <textarea class="text" placeholder="the task" maxlength="70"></textarea>
            <button class="more"><b>...</b></button>
            <div class="buttons">
                <button class="status">finish</button>
                <button class="edit" style="display:none;">edit</button>
                <button class="delete" style="display:none;">delete</button>
                <button class="save">Save</button>
                <button class="cancel">Cancel</button>
            </div>
        </div>
    `;

    container.appendChild(task);
    task.focus();

    const moreButton = task.querySelector('.more');
    const editButton = task.querySelector('.edit');
    const deleteButton = task.querySelector('.delete');
    const saveButton = task.querySelector('.save');
    const cancelButton = task.querySelector('.cancel');
    const finishButton = task.querySelector('.status');

    moreButton.addEventListener('click', function() {
        toggleButtons(moreButton);
    });

    editButton.addEventListener('click', function() {
        edit(editButton);
    });

    deleteButton.addEventListener('click', function () {
        deleteTask(deleteButton);
    });    

    saveButton.addEventListener('click', function() {
        save(saveButton);
    });

    cancelButton.addEventListener('click', function() {
        task.remove();
    });

    finishButton.addEventListener('click', function () {
        finish(finishButton);
    });

    task.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function save(saveBtn) {
    const holder = saveBtn.closest('.holder');
    const textareaElement = holder.querySelector('textarea');
    const textarea = textareaElement.value;

    if (!textarea) {
        alert('Please you cannot add an empty task');
        return;
    }

    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch('https://todolist-6qfg.onrender.com/api/tasks/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ task: textarea })
        });

        const result = await response.json();

        if (result.success) {
            console.log('Task added successfully:', result.message);

            const taskDiv = holder.closest('.task');
            taskDiv.setAttribute('data-id', result.taskId);

            const cancelBtn = holder.querySelector('.cancel');
            const editBtn = holder.querySelector('.edit');
            const deleteBtn = holder.querySelector('.delete');

            cancelBtn.style.display = 'none';
            saveBtn.style.display = 'none';
            editBtn.style.display = 'inline-block';
            deleteBtn.style.display = 'inline-block';

            textareaElement.readOnly = true;
            textareaElement.style.border = '';
        } else {
            console.log('Failed to add task:', result.message);
        }
    } catch (error) {
        console.error('Error while adding task:', error);
    }
}

async function edit(editBtn) {
    const holder = editBtn.closest('.holder');
    const textarea = holder.querySelector('textarea');
    const taskDiv = holder.closest('.task'); 
    const taskId = taskDiv?.getAttribute('data-id');

    if (!taskId) {
        alert("Task ID not found!");
        return;
    }

    if (textarea.readOnly) {
        textarea.readOnly = false;
        editBtn.textContent = 'unedit';
        textarea.style.border = '2px solid black';
        textarea.focus();
    } else {
        const updatedText = textarea.value.trim();

        if (!updatedText) {
            alert("Task cannot be empty.");
            return;
        }

        try {
            const token = localStorage.getItem('authToken');

            const response = await fetch(`https://todolist-6qfg.onrender.com/api/tasks/update?id=${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ text: updatedText })
            });

            const result = await response.json();

            if (result.success) {
                console.log("Updated task:", result.task);
            } else {
                console.error("Server error:", result.message);
            }

        } catch (error) {
            console.error('Error while updating task:', error);
        }

        textarea.readOnly = true;
        textarea.style.border = '';
        editBtn.textContent = 'edit';
    }
}

async function finish(button) {
    const holder = button.closest('.holder');
    const textarea = holder.querySelector('.text');
    const taskDiv = holder.closest('.task');
    const taskId = taskDiv.getAttribute('data-id');

    if (!taskId) {
        alert('Task must be saved before finishing');
        return;
    }

    const isFinished = button.textContent.toLowerCase() === 'unfinish';

    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`https://todolist-6qfg.onrender.com/api/tasks/${isFinished ? 'unfinish' : 'finish'}?id=${taskId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            if (isFinished) {
                textarea.style.textDecoration = 'none';
                button.textContent = 'finish';
            } else {
                textarea.style.textDecoration = 'line-through';
                button.textContent = 'unfinish';
            }
        } else {
            alert('Could not change task status');
        }
    } catch (e) {
        console.error('Error toggling finish status', e);
    }
}

async function deleteTask(deleteBtn) {
    const taskDiv = deleteBtn.closest('.task');
    const taskId = taskDiv.getAttribute('data-id');

    if (!taskId) {
        alert("Task ID not found!");
        return;
    }

    try {
        const token = localStorage.getItem('authToken');

        const response = await fetch(`https://todolist-6qfg.onrender.com/api/tasks/delete?taskId=${taskId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (result.success) {
            console.log('Task deleted:', result.message);
            taskDiv.remove();
        } else {
            console.error('Failed to delete task:', result.message);
        }
    } catch (error) {
        console.error('Error while deleting task:', error);
    }
}
