let pomodoroTime = 30;
let shortBreakTime = 5;
let longBreakTime = 15;
let timerTime = pomodoroTime;
let paused = false;
let skipping = false;
let pomodoroNumber = 1;

const container = document.querySelector('container');
const timerStatus = document.querySelector('.status');
const timer = document.querySelector('.timer');
const start = document.querySelector('#start');
const pause = document.querySelector('#pause');
const skip = document.querySelector('#skip');
const settings = document.querySelector('#settings');
const close = document.querySelector('#close');
const pomodoroDuration = document.querySelector('#pomodoroDuration');
const shortBreakDuration = document.querySelector('#shortBreakDuration');
const longBreakDuration = document.querySelector('#longBreakDuration');

timer.textContent = minutesAndSeconds(timerTime);

// FUNCTION TO CHANGE THE TIME + DISPLAY ON TIMER

function updateTime(newTime) {
    timerTime = newTime;
    timer.textContent = minutesAndSeconds(timerTime);
}

// FUNCTION TO CONVERT SECONDS TO MINUTES AND SECONDS

function minutesAndSeconds(time) {
    let timerMinutes = (Math.floor(time / 60)).toString();
    let timerSeconds = (time % 60).toString();
    timerMinutes = timerMinutes.length === 1 ? "0" + timerMinutes : timerMinutes;
    timerSeconds = timerSeconds.length === 1 ? "0" + timerSeconds : timerSeconds;
    return `${timerMinutes}:${timerSeconds}`;
}

// FUNCTION TO DECREMENT TIME IN 1 SECOND

function decrementTime() {
    return new Promise(resolve => {
        setTimeout(() => {
            !paused && timerTime--;
            timer.textContent = minutesAndSeconds(timerTime);
            resolve();
        }, 1000)
    })
}

// FUNCTION TO COUNTDOWN FROM TIMER TIME TO 0

async function countdown(countdownFrom) {
    updateTime(countdownFrom);
    while(timerTime > 0 && !skipping) {
        await decrementTime(timerTime);
    }
    skipping = false;
    return;
}

// FUNCTIONS TO CHANGE WHICH BUTTONS ARE VISIBLE WHEN TIMER IS ACTIVE VS INACTIVE

function timerActiveDisplay() {
    start.style.display = 'none';
    pause.style.display = 'block';
    skip.style.display = 'block';
}

function timerInactiveDisplay() {
    start.style.display = 'block';
    pause.style.display = 'none';
    skip.style.display = 'none';
}

// FUNCTIONS TO START (AND FINISH) POMODORO AND BREAK

async function startPomodoro() {
    timerActiveDisplay();
    await countdown(timerTime);
    document.body.classList.add('break');
    let isLongBreak = pomodoroNumber % 4 === 0;
    timerStatus.textContent = isLongBreak ? "LONG BREAK" : "SHORT BREAK";
    updateTime(isLongBreak ? longBreakTime : shortBreakTime);
    pomodoroNumber++;
    timerInactiveDisplay();
}

async function startBreak() {
    timerActiveDisplay();
    await countdown(timerTime);
    timerStatus.textContent = `POMODORO #${pomodoroNumber}`;
    document.body.classList.remove('break');
    updateTime(pomodoroTime);
    timerInactiveDisplay();
}

// BUTTON TO START POMODORO OR BREAK

start.addEventListener('click', () => {
    const func = document.body.classList.contains('break') ? startBreak : startPomodoro;
    func();
})

// BUTTONS TO TOGGLE MODAL

settings.addEventListener('click', () => {
    document.body.classList.toggle("modal--open");
})

close.addEventListener('click', () => {
    document.body.classList.toggle("modal--open");
})

// ADJUST POMODORO, SHORT BREAK AND LONG BREAK DURATION

pomodoroDuration.addEventListener('change', () => {
    pomodoroTime = +pomodoroDuration.value;
    if(start.style.display !== 'none') {
        updateTime(pomodoroTime);
    }
})

shortBreakDuration.addEventListener('change', () => {
    shortBreakTime = +shortBreakDuration.value;
    if(start.style.display !== 'none' && pomodoroDuration % 4 !== 0) {
        updateTime(shortBreakTime);
    }
})

longBreakDuration.addEventListener('change', () => {
    longBreakTime = +longBreakDuration.value;
    if(start.style.display !== 'none' && pomodoroNumber % 4 === 0) {
        updateTime(longBreakTime);
    }
})

// PAUSE AND SKIP BUTTONS

pause.addEventListener('click', () => {
    paused = !paused;
    pause.textContent = paused ? "RESUME" : "PAUSE";
})

skip.addEventListener('click', () => {
    skipping = true;
})



