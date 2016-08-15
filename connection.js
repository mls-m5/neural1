
function createConnection(from, to) {
    var connection = {
        from: from,
        to: to,
        weight: Math.round(Math.random() * 200 - 100) / 100,
        newWeight: 0, //Ska användas när ändringarna beräknas
        nodeDelta: 0,
        prepareCalculation: function() {
            this.newWeight = this.weight;
        },
        finalizeCalculations: function() {
            this.weight = this.newWeight;
        },
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
            ctx.fillText(twoDecimals(this.weight), midx, midy - 15);
        }
    };
    network.connections.push(connection);
    to.fromConnections.push(connection);
    from.toConnections.push(connection);
    return connection;
}
