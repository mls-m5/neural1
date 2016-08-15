network = {
    units: [],
    connections: [],
    learningRate: .1,
    map: {}, //Used for named training sets
    totalError: 0,
    
    calculate() {
        totalError = 0;
        for (var i in this.units) {
            var unit = this.units[i];
            unit.calculate();
            totalError += unit.error2;
        }
    },
    
    draw: function() {
        for (var i in this.connections) {
            this.connections[i].draw();
        }
        for (var i in this.units) {
            this.units[i].draw();
        }
    },
    
    setTrainingSet(set) {
        for (var i in set) {
            var unit = this.map[i];
            if (unit.type == "in") {
                unit.value = set[i];
            }
            else if(unit.type == "out") {
                unit.targetValue = set[i];
            }
        }
    }
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

function createUnit(name, x, y, type) {
    var unit = {
        name: name,
        x: x,
        y: y,
        value: 1, //Use to be called "out" in documentations
        type: type,
        targetValue: 0,
        intermediateValue: 0,
        fromConnections: [],
        toConnections: [],
        error2: 0,
        color: "#000",
        draw: function() {
            ctx.fillStyle = this.color;
            drawCircle(this.x, this.y);
            ctx.fillStyle = "black"
            
            if(this.type == "out") {
                ctx.textAlign = "start";
                ctx.fillText(twoDecimals(this.targetValue) + ", e=" + twoDecimals(this.value - this.targetValue), this.x + 20, this.y)
            }
            
            
            if(this.type == "in" || this.type == "const") {
                ctx.textAlign = "end";
                ctx.fillText(twoDecimals(this.value), this.x - 20, this.y)
                ctx.textAlign = "center";
            }
            else {
            
                ctx.textAlign = "center";
                ctx.fillText(twoDecimals(this.intermediateValue), this.x, this.y - 15)
                ctx.fillText(twoDecimals(this.value), this.x, this.y + 20)
            }
            
        },
        calculate() {
            //Calculate the values
            if (this.fromConnections.length == 0) {
                return;
            }
            this.intermediateValue = 0;
            for (var i in this.fromConnections) {
                this.intermediateValue += this.fromConnections[i].from.value * 
                    this.fromConnections[i].weight;
            }
            
            this.value = activationFunction(this.intermediateValue);
            
            if (this.type="out") {
                var e = this.targetValue - this.value;
                this.error2 = e*e / 2;
            }
        },
        backPropagate() {
            /*if (this.type == "input" || this.type == "constant") {
                return; //Cannot backpropagate longer
            }
            this.nodeDelta = -(this.targetValue - this.value) * this.value * (1 - this.value);
            
            for (var i in this.fromConnections) {
                var connection = this.fromConnections[i];
                
            }*/
        }
    };
    
    if (type=="const") {
        unit.color = "#0000ff";
    }
    else if(type=="out") {
        unit.color = "#ff0000";
    }
    network.units.push(unit);
    network.map[unit.name] = unit;
	return unit;
};

function createConnection(from, to) {
    var connection = {
        from: from,
        to: to,
        weight: Math.round(Math.random() * 200 - 100) / 100,
        newWeight: 0, //Ska användas när ändringarna beräknas
        nodeDelta: 0,
        draw: function() {
            if (this.weight < 0) {
                ctx.setLineDash([5]);
                ctx.strokeStyle = "rgba(265, 0, 0, " + -this.weight + ")";
                ctx.lineWidth = 3;
            }
            else {
                ctx.strokeStyle = "rgba(0, 0, 0, " + this.weight + ")";
            }
            ctx.lineWidth = 1;
            ctx.setLineDash([]);
            drawLine(this.from.x, this.from.y, this.to.x, this.to.y);
            ctx.strokeStyle = "black";
            midx = (this.from.x + this.to.x) / 2;
            midy = (this.from.y + this.to.y) / 2;
            ctx.fillText(this.weight, midx, midy - 15);
        }
    };
    network.connections.push(connection);
    to.fromConnections.push(connection);
    from.toConnections.push(connection);
    return connection;
}



var canvas;
var ctx;


function drawLine(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
    
}

$(document).ready(function() {
	window.canvas = document.getElementById("neural_canvas");
	window.ctx = canvas.getContext("2d");
    
    x1 = createUnit("x1", 100, 100, "in");
    x2 = createUnit("x2", 100, 200, "in");
    b = createUnit("bias", 150, 70, "const");
    y = createUnit("y1", 200, 150, "out");
    
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
            y1: 1
        },
        {
            x1: 1,
            x2: 0,
            y1: 1
        },
    ];
    
    network.setTrainingSet(training_sets[0]);
    
    
    network.calculate();
    
    network.draw();
    
    console.log(JSON.stringify(training_sets));
});
