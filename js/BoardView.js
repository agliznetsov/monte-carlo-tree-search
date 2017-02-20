class BoardView {
    constructor(selector, board, boardClick) {
        this.selector = selector;
        this.board = board;
        this.boardClick = boardClick;
        this.cellSize = 30;
        this.width = board.width * this.cellSize;
        this.height = board.height * this.cellSize;
        $(selector).click(this.onClick.bind(this));
        this.drawGrid();
        this.refresh();
    }

    onClick(e) {
        let parent = $(this.selector).offset();
        let y = Math.floor((e.pageY - parent.top) / this.cellSize);
        let x = Math.floor((e.pageX - parent.left) / this.cellSize);
        this.boardClick(x, y)
    }

    drawGrid() {
        let container = d3.select(this.selector);
        container.selectAll("*").remove();

        let grid = container.append("div")
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
        let container = d3.select(this.selector);
        let data = [];
        let that = this;
        _.forOwn(this.board.cells, function (value, key) {
            data.push({
                id: key,
                cell: that.board.cell(key),
                value: value,
                win: that.board.win && that.board.win.cells[key]
            })
        });

        let cells = container.selectAll(".cell").data(data, (d) => d.id);

        cells.enter()

            .append("div")
            .classed("cell", true)
            .classed("win", (d) => d.win)
            .style('left', (d) => (d.cell.x * this.cellSize) + "px")
            .style('top', (d) => (d.cell.y * this.cellSize) + "px")

            .append("i")
            .attr("class", "fa")
            .classed("fa-close", (d) => d.value == 1)
            .classed("fa-circle-o", (d) => d.value == 2);

        container.selectAll(".cell").data(data).merge(cells).classed("win", (d) => d.win)

    }
}