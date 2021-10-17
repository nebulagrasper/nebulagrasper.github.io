'use strict'

let task = [];
let taskId = 665;
rebuildFromLS();

//main inputs
const taskInput = document.querySelector('.new-task-input');
const taskNote = document.querySelector('.new-task-note-input');
const taskButton = document.querySelector('.new-task-submit');

taskButton.onclick = addNewTask;

//restore stuff from localstorage
function rebuildFromLS() {
    task = JSON.parse(localStorage.getItem('task'));
    taskId = JSON.parse(localStorage.getItem('taskId'));
    if (task == null) {
        task = [];
    } else {
        task.forEach((element, index) => {
            addNewTaskDiv(element.id);
        })
    }
}

//add task to the array and increase task id by one
function addNewTask() {
    if (taskInput.value == '') return;
    taskId++;
    let newTask = {id: taskId, task: taskInput.value, note: taskNote.value, color: 0, status: 0};
    task.push(newTask);
    taskInput.value = '';
    taskNote.value = '';

    addNewTaskDiv(taskId);
}

//add task div to the page
function addNewTaskDiv(id) {
    let newTaskDiv = document.createElement('div');
    newTaskDiv.classList.add('task-element');
    newTaskDiv.setAttribute('task-id', id);
    let taskIndex = task.findIndex(element => element.id == id);

    colorCheck(newTaskDiv, taskIndex);
    newTaskDiv.classList.add(task[taskIndex].color);
    newTaskDiv.innerHTML = `
        <div class="element-text">
            <div class="task-name"><h3>${task[taskIndex].task}</h3></div>
            <div class="task-note"><p>${task[taskIndex].note}</p></div>
        </div>
        <div class="element-buttons">
            <button class="task-element-button button-done">
                <i class="fas fa-check fa-xl"></i>
            </button>
            <button class="task-element-button button-delete">
                <i class="fas fa-trash-alt fa-xl"></i>
            </button>
        </div>
    `;

    if (task[taskIndex].status == 1) {
        document.querySelector('.list-board-finished-container').prepend(newTaskDiv);
    } else {
        document.querySelector('.list-board-tasks-container').prepend(newTaskDiv);
    }

    document.querySelector('.button-done').onclick = markAsDone;
    document.querySelector('.button-delete').onclick = deleteTask;

    localStorage.setItem('task', JSON.stringify(task));
    localStorage.setItem('taskId', JSON.stringify(taskId));
}

//mark task as finished and move to the finished list
function markAsDone() {
    let currentDiv = this.parentNode.parentNode;
    let attTaskId = currentDiv.getAttribute('task-id');
    let taskIndex = task.findIndex(element => element.id == attTaskId);
    task[taskIndex].status = 1;
    document.querySelector('.list-board-tasks-container').removeChild(currentDiv);
    document.querySelector('.list-board-finished-container').prepend(currentDiv);
    localStorage.setItem('task', JSON.stringify(task));
}

//deletes a task from an array and page
function deleteTask() {
    let currentDiv = this.parentNode.parentNode;
    let attTaskId = currentDiv.getAttribute('task-id');
    let taskIndex = task.findIndex(element => element.id == attTaskId);
    task.splice(taskIndex, 1);
    currentDiv.remove();
    localStorage.setItem('task', JSON.stringify(task));
}

//hides finished tasks list on click
document.querySelector('#finished-list-header').onclick = function hideFinishedList () {
    let finishedList = document.querySelector('.list-board-finished-container').querySelectorAll('.task-element');
    if (finishedList.length > 0) {
        for (let i = 0; i < finishedList.length; i++) {
            finishedList[i].classList.toggle('hidden');
        }
    }
}

//changes the task background color depending on the chosen settings
function colorCheck(div, taskindex) {
    let colorRadio = document.querySelectorAll('input[type="radio"]');
    for (let i = 0; i < colorRadio.length; i++) {
        if (colorRadio[i].checked) {
            switch (colorRadio[i].value) {
                case 'none':
                    break;
                case 'green':
                    task[taskindex].color = 'green';
                    break;
                case 'orange':
                    task[taskindex].color = 'orange';
                    break;
                case 'red':
                    task[taskindex].color = 'red';
            }
        }
    }
}

//pizdec
let colorButtons = document.querySelectorAll('input[type="radio"]');
colorButtons.forEach(element => {
    element.onchange = () => {
        for (let i = 0; i < colorButtons.length; i++) {
            colorButtons[i].parentNode.classList.remove('checked-color');
            if (colorButtons[i].checked) colorButtons[i].parentNode.classList.add('checked-color');
        }
    }
});