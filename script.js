document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const countdownElement = document.getElementById('time');
    const completionSound = document.getElementById('completion-sound');
    let countdownInterval;
    let countdownTime = 0;

    // Update date and time
    function updateDateTime() {
        const now = new Date();
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        const timeOptions = { hour: '2-digit', minute: '2-digit' };

        document.getElementById('date').textContent = now.toLocaleDateString('en-US', dateOptions);
        document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', timeOptions);
    }

    setInterval(updateDateTime, 1000);

    // To-do list functionality
    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const taskText = taskInput.value;
        const li = document.createElement('li');
        li.className = 'task-item';

        // Create container for radio icon and task text
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';

        // Create radio icon for completing tasks
        const radioIcon = document.createElement('i');
        radioIcon.classList.add('far', 'fa-circle'); // Font Awesome empty radio button
        taskContainer.appendChild(radioIcon);

        // Create task content
        const taskContent = document.createElement('span');
        taskContent.textContent = taskText;
        taskContent.className = 'task-text';
        taskContainer.appendChild(taskContent);

        li.appendChild(taskContainer);

        // Create delete button (icon)
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fas fa-minus-circle"></i>'; // Font Awesome delete icon
        deleteBtn.className = 'delete';
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
        taskInput.value = '';
        
        // Toggle task completion by clicking on the radio icon
        radioIcon.addEventListener('click', function() {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                radioIcon.classList.replace('fa-circle', 'fa-check-circle'); // Font Awesome checked radio button
                taskContent.classList.add('completed-text');
                completionSound.volume = 0.5;
                completionSound.play();
            } else {
                radioIcon.classList.replace('fa-check-circle', 'fa-circle'); // Unchecked radio button
                taskContent.classList.remove('completed-text');
            }
        });

        // Edit task functionality by clicking on the task text
        taskContent.addEventListener('click', function() {
            const currentText = taskContent.textContent;

            // Create an input field to edit the task
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.value = currentText;
            inputField.className = 'edit-input';

            // Replace the task content with the input field
            taskContent.replaceWith(inputField);

            // Focus on the input field
            inputField.focus();

            // Save changes on 'Enter' key or blur event
            inputField.addEventListener('blur', saveTask);
            inputField.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    saveTask(event);
                }
            });

            function saveTask() {
                const newText = inputField.value.trim();

                if (newText !== '') {
                    taskContent.textContent = newText;
                }

                // Replace the input field with the updated task content
                inputField.replaceWith(taskContent);
            }
        });

        // Delete task functionality
        deleteBtn.addEventListener('click', function() {
            li.remove();
        });
    });

    // Timer functionality
    function updateTimerDisplay() {
        const minutes = Math.floor(countdownTime / 60);
        const seconds = countdownTime % 60;
        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer(seconds) {
        clearInterval(countdownInterval); // Clear any previous timers

        const now = Date.now();
        const then = now + seconds * 1000;

        countdownInterval = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);

            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                displayTimeLeft(0); // Reset the timer to 00:00 when it finishes
                return;
            }

            displayTimeLeft(secondsLeft);
        }, 1000);

        countdownTime = seconds;
        updateTimerDisplay();
    }

    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainderSeconds = seconds % 60;
        const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
        countdownElement.textContent = display;
    }

    function stopTimer() {
        clearInterval(countdownInterval);
        countdownInterval = null;
        countdownTime = 0;
        countdownElement.textContent = 'Focus Timer';
        timerButtons.forEach(button => button.classList.remove('active'));
    }

    function setActiveButton(button) {
        timerButtons.forEach(btn => btn.classList.remove('active')); // Remove active class from all buttons
        button.classList.add('active'); // Add active class to the clicked button
    }

    // Event listeners for timer buttons
    const timerButtons = document.querySelectorAll('.timer-button[data-time]');
    timerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const time = parseInt(this.dataset.time, 10);
            startTimer(time);
            setActiveButton(this); // Set the clicked button as active
        });
    });

    // Stop Timer functionality
    document.getElementById('stop-timer').addEventListener('click', function () {
        stopTimer();
    });
});