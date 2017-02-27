import * as d3 from 'd3';
import * as _ from 'lodash';
import * as $ from 'jquery';

import MessageBus from './MessageBus';
import BarChart from './BarChart';
import LineChart from './LineChart';
import TicTacToeBoard from './TicTacToeBoard';
import ConnectFourBoard from './ConnectFourBoard';
import BoardView from './BoardView';
import AI from './AI';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../css/main.css";
import {Board} from "./Board";

class App {
    private barChart;
    private lineChart;
    private boardView: BoardView;
    private board: Board;
    private timer;
    private player: number;
    private iteration: number;
    private confidences;
    private ai;
    private stop;
    private start;
    private aiResult;

    init() {
        $('#restart').click(this.restart.bind(this));
        $('#analyze').click(this.analyze.bind(this));
        $('#game').change(this.restart.bind(this));
        MessageBus.get().subscribe('move-selected', (e) => this.onMoveSelected(e));
        this.barChart = new BarChart('#moves-chart');
        this.lineChart = new LineChart('#line-chart');
        this.restart();
    }

    onMoveSelected(move) {
        if (move >= 0) {
            this.boardView.refresh({move: move, player: this.ai.player});
        } else {
            this.boardView.refresh();
        }
    }

    onClick(x, y) {
        if (!this.board.win && !this.board.get(x, y) && !this.timer) {
            this.makeMove(x, y);
            if (!this.board.win) {
                this.analyze();
            }
        }
    }

    makeMove(x: number, y: number) {
        let cell = this.board.makeMove(x, y, this.player);
        this.board.findWinner(cell.x, cell.y);
        if (!this.board.win) {
            this.player = Board.nextPlayer(this.player);
        }
        this.refresh();
    }

    analyze() {
        if (!this.timer) {
            $('#analyze > i').attr('class', 'fa fa-stop');
            this.lineChart.reset();
            this.iteration = 0;
            this.ai = new AI(this.board, this.player);
            this.stop = false;
            this.start = new Date().getTime();
            this.confidences = [];
            this.timer = d3.timer(this.onTimer.bind(this));
        } else {
            this.stop = true;
        }
    }
    
    onTimer(elapsed) {
        let frameStart = new Date().getTime();
        while (new Date().getTime() - frameStart < 100) { //10 fps
            this.ai.step();
            this.iteration++;
        }
        this.aiResult = this.ai.getResult();
        let time = (new Date().getTime() - this.start) / 1000;
        this.barChart.refresh(this.aiResult);
        this.boardView.refresh({move: this.aiResult.moves[0].move, player: this.ai.player});
        $('#iterations').text(this.iteration);
        $('#confidence').text(this.format(this.aiResult.confidence));
        $('#time').text(this.format(time));
        this.lineChart.addDataPoint(this.aiResult.confidence);
        this.confidences.push(this.aiResult.confidence);
        let std = this.drawConfidenceLine();
        if (elapsed > 15000 || this.stop || (this.aiResult.confidence > 2) || (std > -1 && std < 0.03 && this.iteration > 1000)) {
            $('#analyze > i').attr('class', 'fa fa-play');
            let cell = this.board.cell(this.aiResult.moves[0].move);
            this.makeMove(cell.x, cell.y);
            this.timer.stop();
            this.timer = undefined;
        }
    }

    format(value: number) {
        return Math.round(value * 100) / 100;
    }

    drawConfidenceLine() {
        if (this.confidences.length >= 20) {
            let arr = this.confidences.slice(this.confidences.length - 20, -1);
            let mean = _.mean(arr);
            let variance = _.sumBy(arr, (it: any) => Math.pow(it - mean, 2)) / arr.length;
            let std = Math.sqrt(variance);
            return std;
        } else {
            return -1;
        }
    }

    refresh() {
        let that = this;
        this.boardView.refresh();
        d3.select('#player').selectAll("*").remove();
        d3.select('#player')
            .append("div")
            .classed("cell", true)
            .classed("win", (d) => that.board.win != null)
            .append("i")
            .attr("class", "fa")
            .classed("fa-close", (d) => that.player == 1)
            .classed("fa-circle-o", (d) => that.player == 2);
    }

    restart() {
        let game = $('#game').val();
        if (game == 't') {
            this.board = new TicTacToeBoard(15, 15, 5);
            this.board.init();
        } else if (game == 'c') {
            this.board = new ConnectFourBoard();
            this.board.init();
        }
        this.player = 1;
        this.aiResult = undefined;
        this.boardView = new BoardView('#board', this.board, this.onClick.bind(this));
        this.barChart.refresh();
        this.refresh();
        this.lineChart.reset();
    }

}

new App().init();