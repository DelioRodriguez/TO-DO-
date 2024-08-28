let editingTaskId = null;

document.addEventListener('DOMContentLoaded', function() {
    fetchTasks();
});

function fetchTasks() {
    fetch('http://localhost:5163/api/Tasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const li = document.createElement('li');
                li.classList.add('task-item');
                li.innerHTML = `
                    <div class="task-header">
                        <span>${task.title}</span>
                        <span>${task.content}</span>
                        <div>
                            <button class="edit" onclick="editTask(${task.id}, '${task.title}', '${task.content}', ${task.isCompleted})">Editar</button>
                            <button onclick="deleteTask(${task.id})">Eliminar</button>
                        </div>
                    </div>
                    <div>
                        <input type="checkbox" ${task.isCompleted ? 'checked' : ''} disabled />
                        <label>Completada</label>
                    </div>
                `;
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}


function createTask() {
    const title = document.getElementById('taskTitle').value.trim();
    const content = document.getElementById('taskContent').value.trim();
    const isCompleted = document.getElementById('taskCompleted').checked;

    if (!title || !content) {
        alert('Task title and content cannot be empty');
        return;
    }

    fetch('http://localhost:5163/api/Tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, isCompleted })
    })
    .then(response => {
        if (response.ok) {
            fetchTasks();
            document.getElementById('taskTitle').value = '';
            document.getElementById('taskContent').value = '';
            document.getElementById('taskCompleted').checked = false;
        } else {
            alert('Failed to create task');
        }
    })
    .catch(error => console.error('Error creating task:', error));
}


function editTask(id, title, content, isCompleted) {
    document.querySelector('.edit-form-container').style.display = 'block';
    document.getElementById('editTaskTitle').value = title;
    document.getElementById('editTaskContent').value = content;
    document.getElementById('editTaskCompleted').checked = isCompleted;
    editingTaskId = id; 
}


function saveTask() {
    const title = document.getElementById('editTaskTitle').value.trim();
    const content = document.getElementById('editTaskContent').value.trim();
    const isCompleted = document.getElementById('editTaskCompleted').checked;

    if (!title || !content) {
        alert('Task title and content cannot be empty');
        return;
    }

    fetch(`http://localhost:5163/api/Tasks/${editingTaskId}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: editingTaskId, 
            title,
            content,
            isCompleted
        })
    })
    .then(response => {
        if (response.ok) {
            fetchTasks();
            cancelEdit(); 
        } else {
            response.text().then(text => alert(`Failed to update task: ${text}`));
        }
    })
    .catch(error => console.error('Error updating task:', error));
}


function cancelEdit() {
    document.querySelector('.edit-form-container').style.display = 'none';
    editingTaskId = null; 
}


function deleteTask(id) {
    fetch(`http://localhost:5163/api/Tasks/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            response.text().then(text => alert(`Failed to delete task: ${text}`));
        } else {
            fetchTasks(); 
        }
    })
    .catch(error => console.error('Error deleting task:', error));
}
