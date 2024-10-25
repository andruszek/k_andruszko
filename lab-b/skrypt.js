class Todo {
    constructor() {
        this.tasks = [];
        this.term = '';
        this.taskContainer = document.getElementById('taskContainer');
        this.searchInput = document.getElementById('search');
        this.loadTasksFromLocalStorage();
        this.attachSearchListener();
    }


    get filteredTasks() {
        return this.tasks.filter(task =>
            task.text.toLowerCase().includes(this.term.toLowerCase())
        );
    }


    draw() {
        this.taskContainer.innerHTML = '';

        this.filteredTasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.classList.add('task');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed || false;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                this.saveTasksToLocalStorage();
                this.draw();
            });

            const taskLabel = document.createElement('label');
            taskLabel.innerHTML = this.highlightText(task.text);
            taskLabel.classList.add('task-label');
            taskLabel.addEventListener('click', () => this.editTask(index));

            taskDiv.appendChild(checkbox);
            taskDiv.appendChild(taskLabel);

            if (task.dueDate) {
                const dateText = document.createElement('span');
                dateText.textContent = `${task.dueDate}`;
                dateText.classList.add('due-date');
                dateText.addEventListener('click', () => this.editTask(index));
                taskDiv.appendChild(dateText);
            }

            const deleteIcon = document.createElement('i');
            deleteIcon.innerHTML = '&#9747;';
            deleteIcon.classList.add('delete-icon');
            deleteIcon.addEventListener('click', () => this.deleteTask(index));

            taskDiv.appendChild(deleteIcon);
            this.taskContainer.appendChild(taskDiv);
        });
    }


    highlightText(text) {
        if (!this.term) return text;
        const regex = new RegExp(`(${this.term})`, 'gi');
        return text.replace(regex, '<span style="background-color: yellow;">$1</span>');
    }


    addTask(taskText, dueDate) {
        if (this.validateTask(taskText, dueDate)) {
            this.tasks.push({ text: taskText, dueDate: dueDate || '', completed: false });
            this.saveTasksToLocalStorage();
            this.draw();
        }
    }


    editTask(index) {
        const task = this.tasks[index];
        const taskDiv = this.taskContainer.children[index];

        taskDiv.innerHTML = '';

        const editForm = document.createElement('form');
        editForm.classList.add('edit-form');

        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.value = task.text;
        textInput.required = true;
        editForm.appendChild(textInput);

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = task.dueDate || '';
        editForm.appendChild(dateInput);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Zapisz';
        editForm.appendChild(saveButton);

        taskDiv.appendChild(editForm);

        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newText = textInput.value.trim();
            const newDate = dateInput.value;

            if (this.validateTask(newText, newDate)) {
                this.tasks[index] = { text: newText, dueDate: newDate, completed: task.completed };
                this.saveTasksToLocalStorage();
                this.draw();
            }
        });
    }

    validateDate(date) {
       // return date && new Date(date) >= new Date();
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate >= today;
    }

    validateTask(text, date) {
        const minLength = 3;
        const maxLength = 255;
        if (text.length < minLength || text.length > maxLength) {
            alert(`Tekst zadania musi mieć od ${minLength} do ${maxLength} znaków.`);
            return false;
        }
        if (date && !this.validateDate(date)) {
            alert("Data wykonania musi być w przyszłości.");
            return false;
        }
        return true;
    }

    deleteTask(index) {
        this.tasks.splice(index, 1);
        this.saveTasksToLocalStorage();
        this.draw();
    }

    saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    loadTasksFromLocalStorage() {
        this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        this.draw();
    }

    attachSearchListener() {
        this.searchInput.addEventListener('input', () => {
            this.term = this.searchInput.value;
            this.draw();
        });
    }
}


const todoApp = new Todo();

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('task');
const dateInput = document.getElementById('date');

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const dueDate = dateInput.value || '';
    todoApp.addTask(taskText, dueDate);
    taskInput.value = '';
    dateInput.value = '';
});
