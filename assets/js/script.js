const nameInput = $('#task-name');
const dueInput = $('#task-due');
const descInput = $('#task-description');
const taskForm = $('#modal-form');
const taskArea = $('#task-area');
// Retrieve tasks and nextId from localStorage
// let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

// // Todo: create a function to generate a unique task id
// function generateTaskId() {
//     const random = Math.floor(Math.random() * 1000);
//     localStorage.setItem('nextId', JSON.stringify(`${random}`));
// }

// Todo: create a function to create a task card
function createTaskCard(task) {
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
function renderTaskList() {
    const todo = $('#to-do');
    const inProgress = $('#in-progress');
    const done = $('#done');
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

    // ? Use JQuery UI to make task cards draggable
    $('.draggable').draggable({
        opacity: 0.7,
        zIndex: 100,
        // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
        helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
                ? $(e.target)
                : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
                width: original.outerWidth(),
            });
        },
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    // generateTaskId();

    // const name = nameInput.val().trim();
    // const due = dueInput.val();
    // const desc = descInput.val();
    const newTask = {
        name: nameInput.val().trim(),
        id: Math.floor(Math.random() * 1000),
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
function handleDeleteTask(event) {
    // const taskId = $(this).attr('data-task-id');
    // event.preventDefault();
    // taskList.forEach(task => {
    //     if (task.id === taskId) {
    //         taskList.splice(taskList.indexOf(task), 1);
    //     }
    // });
    // const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const id = event.target.parentElement.parentElement.getAttribute('data-task-id');
    console.log(id);
    const filteredTasks = taskList.filter((task) => task.id !== id);
    console.log(filteredTasks);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable[0].dataset.id
}

taskForm.on('submit', handleAddTask)
// taskArea.on('click', '.btn-delete-project', handleDeleteProject);

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
});

const loadTasks = function () {
    if (!taskList) {
        taskList = [];
    }
}
loadTasks();