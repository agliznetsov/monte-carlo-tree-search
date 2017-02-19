class BoardView {
    constructor(selector, board) {
        this.board = board;
        this.cellSize = 30;
        this.width = board.width * this.cellSize;
        this.height = board.height * this.cellSize;
        this.container = d3.select(selector);
        this.container.selectAll("*").remove();
        this.drawGrid();
        this.refresh();
    }

    drawGrid() {
        let grid = this.container.append("div")
            .style("width", this.width + "px")
            .style("height", this.height + "px");

        for (let i = -1; i < this.board.height; i++) {
            grid.append("div")
                .classed("grid-row", true)
                .style("width", this.width + "px")
                .style("top", i * this.cellSize + "px");
        }

        for (let i = -1; i < this.board.width; i++) {
            grid.append("div")
                .classed("grid-column", true)
                .style("height", this.height + "px")
                .style("left", i * this.cellSize + "px");
        }
    }

    refresh() {
        let data = [];
        let that = this;
        _.forOwn(this.board.cells, function (value, key) {
            data.push({
                pos: that.board.movePosition(key),
                value: value
            })
        });
        this.container.selectAll(".cell").data(data).enter()

            .append("div")
            .classed("cell", true)
            .style('left', (d) => d.pos.x * this.cellSize + "px")
            .style('top', (d) => d.pos.y * this.cellSize + "px")

            .append("i")
            .attr("class", "fa fa-lg")
            .classed("fa-close", (d) => d.value == 1)
            .classed("fa-circle-o", (d) => d.value == 2);
    }
}