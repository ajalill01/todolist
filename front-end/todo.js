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

function edit(editBtn) {

    const button = editBtn.parentElement
    const textarea = document.querySelector('.text');
    

    if (textarea.readOnly) {
        textarea.readOnly = false;s
    } else {
        textarea.readOnly = true;
    }
}