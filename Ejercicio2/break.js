importScripts("main.js");
const speed = 40;
let time;
onmessage = (e) => {
    time = e.data * 60;
    console.log('Worker: Message received from main script: ' + e + ' Minutes');
    setInterval(sendTime, 1000/speed)
};

function sendTime() {
    time -= 1;
    postMessage(time);
}
