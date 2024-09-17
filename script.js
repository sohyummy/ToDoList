document.addEventListener("DOMContentLoaded", () => {
    const todoForm = document.getElementById('todo-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const countdownElement = document.getElementById('time');
    let countdownInterval;

    // To-do list functionality
    todoForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const taskText = taskInput.value;
        const li = document.createElement('li');
        li.innerHTML = `${taskText} <button class="delete">Delete</button>`;
        taskList.appendChild(li);
        taskInput.value = '';

        li.addEventListener('click', function() {
            li.classList.toggle('completed');
        });

        li.querySelector('.delete').addEventListener('click', function() {
            li.remove();
        });
    });
});

function displayDateTime() {
    const now = new Date();

    // Format date as "Day, Month Date"
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Format time as "HH:MM AM/PM" without seconds
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeString = now.toLocaleTimeString('en-US', timeOptions);

    document.getElementById('date').textContent = dateString;
    document.getElementById('clock').textContent = timeString;
}

// Initialize the date and time display
displayDateTime();

// Update date and time every minute
setInterval(displayDateTime, 60000); // Update every minute

// Timer Logic
let countdownInterval;
let isTimerRunning = false;

function startTimer(seconds) {
    clearInterval(countdownInterval); // Clear any previous timers

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdownInterval = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft <= 0) {
            clearInterval(countdownInterval);
            displayTimeLeft(0); // Reset the timer to 00:00 when it finishes
            isTimerRunning = false;
            updateStopButtonState(); // Update button state
            return;
        }

        displayTimeLeft(secondsLeft);
    }, 1000);

    isTimerRunning = true;
    updateStopButtonState(); // Update button state
}

function displayTimeLeft(seconds) {
    if (!isTimerRunning) return; // Don't display anything if the timer is stopped

    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.getElementById('time').textContent = display;
}

function updateStopButtonState() {
    const stopButton = document.getElementById('stop-timer');
    if (isTimerRunning) {
        stopButton.classList.remove('disabled');
        stopButton.disabled = false;
    } else {
        stopButton.classList.add('disabled');
        stopButton.disabled = true;
    }
}

// Event listeners for timer buttons
const timerButtons = document.querySelectorAll('.timer-button[data-time]');
timerButtons.forEach(button => button.addEventListener('click', function () {
    const time = parseInt(this.dataset.time);
    startTimer(time);
}));

// Stop Timer functionality
document.getElementById('stop-timer').addEventListener('click', function () {
    clearInterval(countdownInterval); // Stop the timer
    isTimerRunning = false;

    // Replace the timer display with the stop icon
    document.getElementById('time').innerHTML = '<i class="fas fa-stop"></i>'; 

    // Reset the timer display back to "00:00" after a short delay
    setTimeout(() => {
        document.getElementById('time').textContent = '00:00';
    }, 2000); // Delay of 2 seconds before resetting to 00:00

    updateStopButtonState(); // Update button state
});