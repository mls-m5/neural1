network = {
    units: [],
    connections: [],
    learningRate: .3,
    map: {}, //Used for named training sets
    totalError: 0,
    info: "",
    currentTraingingSet: 0,
    
    calculate: function() {
        this.info = "";
        this.totalError = 0;
        for (var i in this.units) {
            var unit = this.units[i];
            unit.calculate();
            this.totalError += unit.error2;
        }
    },
    
    backpropagate: function() {
        for (var i in this.connections) {
            this.connections[i].prepareCalculation();
        }
        for (var i in this.units) {
            this.units[i].backpropagate();
        }
        for (var i in this.connections) {
            this.connections[i].finalizeCalculations();
        }
    },
    
    draw: function() {
        clearCanvas();
        for (var i in this.connections) {
            this.connections[i].draw();
        }
        for (var i in this.units) {
            this.units[i].draw();
        }
        ctx.strokeText(this.info, 300, 10);
        ctx.strokeText(this.currentTraingingSet, 300, 30);
    },
    
    setTrainingSets: function(sets) {
        this.trainingSets = sets;
        this.setTrainingSet(0);
    },
    
    setTrainingSet: function(setIndex) {
        this.currentTrainingSet = setIndex;
        var set = this.trainingSets[setIndex];
        for (var i in set) {
            var unit = this.map[i];
            if (unit.type == unit_types.in) {
                unit.value = set[i];
            }
            else if(unit.type == unit_types.out) {
                unit.targetValue = set[i];
            }
        }
    },
    
    rotateTrainingSet: function() {
        this.currentTrainingSet += 1;
        if (this.currentTrainingSet > this.trainingSets.length) {
            this.currentTrainingSet = 0;
        }
        this.setTrainingSet(this.currentTrainingSet);
    }
}

$(document).ready(function() {
	window.canvas = document.getElementById("neural_canvas");
	window.ctx = canvas.getContext("2d");
    
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
    
    
    network.calculate();
    
    network.draw();
    
    console.log(JSON.stringify(training_sets));
    
    
    $("#step_button").click(function() {
        //network.rotateTrainingSet(); needs bigger network
        network.calculate();
        network.backpropagate();
        network.draw();
    });

});
