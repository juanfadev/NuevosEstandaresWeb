let worker;
const fullyload = () => {
    const taskForm = document.getElementById("taskform");
    const start = document.getElementById("start");
    const taskMinutes = document.getElementById("taskminutes");
    const taskCounter = document.getElementById("taskcounter");
    const breakCounter = document.getElementById("breakcounter");
    const clearTasks  = document.getElementById("cleartasks");
    const taskName = document.getElementById("taskname");
    const counter = document.getElementById("realtaskcounter");
    const currentTask = document.getElementById("tasktext");
    const breakButton = document.getElementById("back");
    const backToWork = document.getElementById("breakback");
    const startBreakButton = document.getElementById("startbreak");
    const breakMinutes = document.getElementById("breakminutes");
    const realBreakCounter = document.getElementById("realbreakcounter");
    const breakForm = document.getElementById("breakform");
    let tasks = localStorage.hasOwnProperty("tasks") ? JSON.parse(localStorage.getItem("tasks")) : [];
    const priorTasks = document.getElementById("priortasks");
    tasks.forEach(t =>{
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(Task.print(t)));
        priorTasks.appendChild(li);
    });

    clearTasks.onclick = () =>{
      localStorage.clear();
    };
    start.onclick = () => {
        console.log(tasks);
        let t = new Task(taskName.value, taskMinutes.value);
        tasks.push(t);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        start.disabled = true;
        worker = new Worker('pomodoro.js');
        worker.postMessage(t);
        taskCounter.style.display = "block";
        worker.onmessage = (e) => {
            let min = ~~(e.data[1] / 60);
            let sec = e.data[1] - min * 60;
            console.log(`Tarea ${e.data[0]}. Quedan ${min}:${sec}`);
            if (min <= 0 && sec <= 0) {
                startBreak();
            }
            console.log(`Tarea ${e.data[0]}. Quedan ${min}:${sec}`);
            if (sec < 10) {
                counter.textContent = `${min}:0${sec}`;
            } else {
                counter.textContent = `${min}:${sec}`;
            }
            currentTask.textContent = e.data[0];
        }
    };
    const startBreak = () => {
        worker.terminate();
        breakButton.disabled = false;
        breakButton.onclick = () => {
            breakForm.style.display = "block";
            taskCounter.style.display = "none";
            breakCounter.style.display = "block";
            taskForm.style.display = "none";
        };
        startBreakButton.onclick = () => {
            startBreakButton.disabled = true;
            worker = new Worker('break.js');
            worker.postMessage(breakMinutes.value);
            worker.onmessage = (e) =>{
                let min = ~~(e.data / 60);
                let sec = e.data - min * 60;
                console.log(`Quedan ${min}:${sec}`);
                if (min <= 0 && sec <= 0) {
                    restart();
                }
                if (sec < 10) {
                    realBreakCounter.textContent = `${min}:0${sec}`;
                } else {
                    realBreakCounter.textContent = `${min}:${sec}`;
                }
            }
        }
    };
    const restart = () => {
        backToWork.disabled= false;
        worker.terminate();
        backToWork.onclick = () =>{
            start.disabled = false;
            breakCounter.display= "none";
            breakForm.style.display = "none";
            taskCounter.style.display = "block";
            taskForm.style.display = "block";
            breakButton.disabled =true;
            backToWork.disabled = true;
        }
    }

};

class Task {
    constructor(name, minutes){
        this.name = name;
        this.initialMinutes = minutes;
        this.time = minutes*60;
    }

    get minutes(){
        return ~~(this.time / 60);
    }
    get seconds(){
        return this.time - this.minutes()*60;
    }

    static print(task){
        return `Tarea ${task.name}, de ${task.initialMinutes} Minutos.`;
    }

    static nextSecond(task){
        task.time -=1;
    }
}


