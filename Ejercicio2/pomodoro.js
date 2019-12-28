importScripts("main.js");
const speed = 10;
let task;
onmessage = (e) => {
    task = e.data;
    console.log('Worker: Message received from main script: ' + Task.print(task));
    setInterval(sendTime, 1000/speed)
};

function sendTime() {
    Task.nextSecond(task);
    console.log(task.time);
    postMessage([task.name, task.time]);
}
