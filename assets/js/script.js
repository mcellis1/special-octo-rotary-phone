const nameInput = $('#task-name');
const dueInput = $('#task-due');
const descInput = $('#task-description');
const taskForm = $('#modal-form');
const taskArea = $('#task-area');
// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

// Todo: create a function to create a task card
const createTaskCard = function (task) {
    const card = $('<div>').addClass('card project-card draggable my-3').attr('data-task-id', task.id);
    const name = $('<h4>').addClass('card-header h4').text(task.name);
    const container = $('<div>').addClass('card-body');
    const text = $('<p>').addClass('card-text').text(task.text);
    const dueEl = $('<p>').addClass('card-text').text(task.dueDate);
    const deleteBtn = $('<button>').addClass('btn btn-danger delete').text('Delete').attr('data-task-id', task.id);
    deleteBtn.on('click', handleDeleteTask);

    if (task.dueDate && task.status !== 'done') {
        const now = dayjs();
        const dueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

        if (now.isSame(dueDate, 'day')) {
            card.addClass('bg-warning text-white');
        } else if (now.isAfter(dueDate)) {
            card.addClass('bg-danger text-white');
            deleteBtn.addClass('border-light');
        }
    }

    container.append(text, dueEl, deleteBtn);
    card.append(name, container);

    return card;
}

// Todo: create a function to render the task list and make cards draggable
const renderTaskList = function () {
    const todo = $('#todo-cards');
    const inProgress = $('#in-progress-cards');
    const done = $('#done-cards');
    todo.empty();
    inProgress.empty();
    done.empty();

    for (let task of taskList) {
        if (task.status === 'to-do') {
            todo.append(createTaskCard(task));
        } else if (task.status === 'in-progress') {
            inProgress.append(createTaskCard(task));
        } else if (task.status === 'done') {
            done.append(createTaskCard(task));
        }
    }

    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        helper: function (e) {
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
const handleAddTask = function (event) {
    event.preventDefault();

    const newTask = {
        name: nameInput.val().trim(),
        id: parseInt(Math.floor(Math.random() * 1000)),
        dueDate: dueInput.val(),
        text: descInput.val(),
        status: 'to-do',
    };

    taskList.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(taskList));

    renderTaskList();

    nameInput.val('');
    dueInput.val('');
    descInput.val('');
}

// Todo: create a function to handle deleting a task
const handleDeleteTask = function (event) {
    const id = event.target.parentElement.parentElement.getAttribute('data-task-id');
    const filteredTasks = taskList.filter((task) => task.id != id);

    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    location.reload();
}

// Todo: create a function to handle dropping a task into a new status lane
const handleDrop = function (event, ui) {
    const id = ui.draggable[0].getAttribute('data-task-id');
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const newStatus = event.target.id;

    for (let task of tasks) {
        if (task.id == id) {
            task.status = newStatus;
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    location.reload();
}

const loadTasks = function () {
    if (!taskList) {
        taskList = [];
    }
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    $('#task-due').datepicker({
        changeMonth: true,
        changeYear: true,
    });
    
    $('.lane').droppable({
        accept: '.draggable',
        drop: handleDrop,
    });
});

taskForm.on('submit', handleAddTask)

loadTasks();
