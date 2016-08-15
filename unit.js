
unit_types = Object.freeze({
    const: 0,
    in: 1,
    out: 2,
    middle: 3
});


function createUnit(name, x, y, type) {
    var unit = {
        name: name,
        x: x,
        y: y,
        value: 1, //Use to be called unit_types.out in documentations
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
            
            if(this.type == unit_types.out) {
                ctx.textAlign = "start";
                ctx.fillText(twoDecimals(this.targetValue) + ", e=" + twoDecimals(this.targetValue - this.value), this.x + 20, this.y)
            }
            
            
            if(this.type == unit_types.in || this.type == unit_types.const) {
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
        
        calculate: function() {
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
            
            //A totaly useless calculation
            if (this.type=unit_types.out) {
                var e = this.targetValue - this.value;
                this.error2 = e*e / 2;
            }
        },
        backpropagate: function() {
            if (this.type == unit_types.in || this.type == unit_types.const) {
                return; //Cannot backpropagate longer
            }
            this.nodeDelta = -(this.targetValue - this.value) * this.value * (1 - this.value);
            
            for (var i in this.fromConnections) {
                var connection = this.fromConnections[i];
                var totalDeriv = this.nodeDelta * connection.from.value;
                network.info += ("total skillnad " + this.name + "-" + connection.from.name + " " + twoDecimals(totalDeriv) + " ");
                connection.newWeight += -totalDeriv * network.learningRate;
            }
        }
    };
    
    if (type==unit_types.const) {
        unit.color = "#0000ff";
    }
    else if(type==unit_types.out) {
        unit.color = "#ff0000";
    }
    network.units.push(unit);
    network.map[unit.name] = unit;
	return unit;
};
