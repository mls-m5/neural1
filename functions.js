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

function createTwoLayerNetwork() {
    
    x1 = createUnit("x1", 100, 100, unit_types.in);
    x2 = createUnit("x2", 100, 200, unit_types.in);
    b = createUnit("bias", 150, 70, unit_types.const);
    y = createUnit("y1", 200, 150, unit_types.out);
    
    createConnection(x1, y);
    createConnection(x2, y);
    createConnection(b, y);
    
    
    
    
    var training_sets = [
        {
            x1: 1,
            x2: 1,
            y1: 1
        },
        {
            x1: 0,
            x2: 0,
            y1: 1
        },
        {
            x1: 0,
            x2: 1,
            y1: 0
        },
        {
            x1: 1,
            x2: 0,
            y1: 0
        },
    ];
    
    network.setTrainingSets(training_sets);
    
    
    console.log(JSON.stringify(training_sets));
    
}

function createThreeLayerNetwork() {
    
    b = createUnit("bias", 150, 120, unit_types.const);
    
    //Create input layer
    for (var i = 1; i <= 2; ++i) {
        var iunit = createUnit("x" + i, 100, 150 + 50 * i, unit_types.in);
    }
    
    //Create hidden layer
    for (var i = 1; i <= 3; ++i) {
        var hunit = createUnit("h" + i, 200, 100 + 70 * i, unit_types.hidden);
    }
    
    //Create output layer
    for (var i = 1; i <= 2; ++i) {
        var ounit = createUnit("o" + i, 300, 150 + 50 * i, unit_types.out);
    }
    
    
    for (var i in network.units) {
        var a = network.units[i];
        for (var j in network.units) {
            var b = network.units[j];
            if (a.type == unit_types.in && b.type == unit_types.hidden) {
                createConnection(a, b);
            }
            else if (a.type == unit_types.hidden && b.type == unit_types.out) {
                createConnection(a, b);
            }
        }
    }
    
    /*
    createConnection(x1, y);
    createConnection(x2, y);
    createConnection(b, y);*/
}