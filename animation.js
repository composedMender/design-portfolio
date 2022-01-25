/*
console.log('Say something');
const canvas = document.querySelector('#wave1');
const canvas2 = document.querySelector('#wave2');
const canvas3 = document.querySelector('#wave3');
const c = canvas.getContext('2d');
const c2 = canvas2.getContext('2d');
const c3 = canvas3.getContext('2d');

const homeCanvas = document.querySelector('#canvas-wrapper');

canvas.width = innerWidth;
canvas.height = innerHeight / 2;

canvas2.width = innerWidth;
canvas2.height = innerHeight / 2;

canvas3.width = innerWidth;
canvas3.height = innerHeight / 2;

const frequency = -0.008;

let increment = frequency;

function initialize() {
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();

}

function resizeCanvas() {
    homeCanvas.width = window.innerWidth;
    homeCanvas.height = window.innerHeight;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 2 ;

    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight / 2;

    canvas3.width = window.innerWidth;
    canvas3.height = window.innerHeight / 2;
}

function animate() {
    requestAnimationFrame(animate);
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    c2.clearRect(0, 0, canvas2.width, canvas2.height);
    c3.clearRect(0, 0, canvas3.width, canvas3.height);

    c.beginPath();
    c2.beginPath();
    c3.beginPath();


    for(let i = 0; i < canvas.width + 50; i++) {
        c.lineTo(i, canvas.height / 1.2 + Math.sin(i * 0.001 + increment) * 125 * Math.sin(increment));
        c2.lineTo(i, canvas2.height / 1.1 + Math.sin(i * 0.002 + increment * 2) * 130 * Math.sin(increment * 0.5));
        c3.lineTo(i, canvas3.height / 1.1 + Math.sin(i * 0.003 + increment) * 100 * Math.sin(increment));
    }

    
    c.moveTo(0, canvas.height / 3);
    c2.moveTo(0, canvas2.height / 3);
    c3.moveTo(0, canvas3.height / 3); 


    c.lineWidth = 400;
    c.strokeStyle = '#347EF9CC';
    c.stroke();

    c2.lineWidth = 300;
    c2.strokeStyle = '#242AC8CC';
    c2.stroke();

    
    c3.lineWidth = 200;
    c3.strokeStyle = '#262F82CC';
    c3.stroke();

    

    increment += frequency;
}
initialize();
animate();
*/

function copy() {
    var copyText = document.getElementById("email");
    var textArea = document.createElement("textarea");
    textArea.value = copyText.textContent;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();

    var tooltip = document.getElementById("tooltip")
    tooltip.innerHTML = "Copied!";
}

function tooltipReset() {
    var tooltip = document.getElementById("tooltip");
    tooltip.innerHTML = "Copy email to clipboard";
}

document.getElementById("copy").addEventListener("click", copy);
document.getElementById("copy").addEventListener("mouseleave", tooltipReset);

