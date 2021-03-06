import * as _ from 'lodash';
import * as d3 from 'd3';
import * as $ from 'jquery';
import {Board} from "./Board";

export default class BoardView {
    readonly cellSize = 30;
    private selector: string;
    private board: Board;
    width: number;
    height: number;

    constructor(selector: string, board: Board) {
        this.selector = selector;
        this.board = board;
        this.width = board.width * this.cellSize;
        this.height = board.height * this.cellSize;

        this.drawGrid();
        this.refresh();
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

    refresh(selectedMove?) {
        let container = d3.select(this.selector);
        let data = [];
        let that = this;
        let selectionAdded = false;
        _.forOwn(this.board.cells, function (value, key) {
            data.push({
                id: key,
                cell: that.board.cell(key),
                value: value,
                win: (that.board.win && that.board.win.cells[key]),
                selected: (selectedMove && key === selectedMove.move)
            });
            if (selectedMove && key === selectedMove.move) {
                selectionAdded = true;
            }
        });
        if (selectedMove && !selectionAdded) {
            data.push({
                id: selectedMove.move,
                cell: that.board.cell(selectedMove.move),
                value: selectedMove.player,
                selected: true
            })
        }

        let cells = container.selectAll(".cell").data(data, (d) => d.id);

        cells.exit().remove();

        cells.enter()

            .append("div")
            .classed("cell", true)
            .classed("win", (d) => d.win)
            .classed("selected", (d) => d.selected)
            .style('left', (d) => (d.cell.x * this.cellSize) + "px")
            .style('top', (d) => (d.cell.y * this.cellSize) + "px")

            .append("i")
            .attr("class", "fa")
            .classed("fa-close", (d) => d.value == 1)
            .classed("fa-circle-o", (d) => d.value == 2);

        container.selectAll(".cell").data(data, (d) => d.id).merge(cells)
            .classed("win", (d) => d.win)
            .classed("selected", (d) => d.selected)

    }

}