var canvas;
var ctx;


function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


function activationFunction(value) {
    //Logistic function //https://en.wikipedia.org/wiki/Logistic_function#Derivative
    
    return 1 / (1 + Math.exp(-value));
}

function activationDerivative(value) {
    return activationFunction(value) * (1-activationFunction(value));
}

function drawCircle(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
}

function twoDecimals(value) {
    return Math.round(value * 100) / 100;
}
