const username = localStorage.getItem('username');
document.getElementById('username').textContent = username.toUpperCase();

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

async function edit(editBtn) {
    const holder = editBtn.closest('.holder');
    const textarea = holder.querySelector('textarea');

    if (textarea.readOnly) {
        textarea.readOnly = false;
        editBtn.textContent = 'unedit';
        textarea.style.border = '2px solid black';
        textarea.focus();

        const taskContent = ""

        try {
            
            const token = localStorage.getItem('authToken'); 
    
            const response = await fetch('http://localhost:5000/api/tasks/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ task: taskContent })
            });
    
            const result = await response.json();


            if (result.success) {
                alert('Task added successfully');
                console.log('Task added successfully:', result.message);
                task.setAttribute('data-id', result.taskId);
            } else {
                alert('Failed to add task');
                console.log('Failed to add task:', result.message);
            }
        } catch (error) {
            alert('Error while adding task');
            console.error('Error while adding task:', error);
        }
    
    } else {
        textarea.readOnly = true;
        textarea.style.border = '';
        editBtn.textContent = 'edit';
    }
}


async function addTask() {
    const container = document.getElementById('tasksContainer');

    const task = document.createElement('div');
    task.className = 'task';

    task.innerHTML = `
        <div class="holder">
            <textarea readonly class="text" placeholder="the task" maxlength="70"></textarea>
            <button class="more"><b>...</b></button>
            <div class="buttons">
                <button class="status">finish</button>
                <button class="edit">edit</button>
                <button class="delete">delete</button>
                <button class="save" style="display:none;">Save</button>
                <button class="cancel" style="display:none;">Cancel</button>
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

    moreButton.addEventListener('click', function() {
        toggleButtons(moreButton);
    });

    editButton.addEventListener('click', function() {
        edit(editButton);
    });

    deleteButton.addEventListener('click', function() {
        task.remove();
    });

    saveButton.addEventListener('click', function() {
        save(saveButton);
    });

    cancelButton.addEventListener('click', function() {
        cancel(cancelButton);
    });

    task.scrollIntoView({ behavior: 'smooth', block: 'center' });

}
