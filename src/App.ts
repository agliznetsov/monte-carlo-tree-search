import * as d3 from 'd3';
import * as _ from 'lodash';
import * as $ from 'jquery';

import MessageBus from './MessageBus';
import BarChart from './BarChart';
import LineChart from './LineChart';
import TicTacToeBoard from './TicTacToeBoard';
import ConnectFourBoard from './ConnectFourBoard';
import BoardView from './BoardView';
import {AI, MTS_AI, MiniMaxAI} from './AI';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../main.css";
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
    private ai: AI;
    private aiSettings;
    private stop;
    private start;
    private aiResult;

    private readonly aiSettingsDefault = {
        c: {
            timeout: 2,
            confidence: 1.5,
            iterations: 15000
        },
        t: {
            timeout: 3,
            confidence: 2,
            iterations: 15000
        }
    };

    init() {
        $('#restart').click(this.restart.bind(this));
        $('#analyze').click(this.analyze.bind(this));
        $('#save').click(this.save.bind(this));
        $('#load').click(this.load.bind(this));
        $('#settings').click(this.configure.bind(this));
        $('#game').change(this.restart.bind(this));

        $('#board').click(this.onBoardClick.bind(this));
        $('#board').contextmenu(this.onBoardRightClick.bind(this));

        $('#form-apply').click(this.formApply.bind(this));
        $('#form-reset').click(this.formReset.bind(this));

        MessageBus.get().subscribe('move-selected', (e) => this.onMoveSelected(e));
        this.barChart = new BarChart('#moves-chart');
        this.lineChart = new LineChart('#line-chart');
        this.loadSettings();
        this.restart();
        this.load();
    }

    onMoveSelected(move) {
        if (move >= 0) {
            this.boardView.refresh({move: move, player: this.ai.player});
        } else {
            this.boardView.refresh();
        }
    }

    onBoardClick(e) {
        let cell = this.getClickedCell(e);
        if (!this.board.win && !this.board.get(cell.x, cell.y) && !this.timer) {
            this.makeMove(cell.x, cell.y);
            if (!this.board.win) {
                this.analyze();
            }
        }
    }

    onBoardRightClick(e) {
        e.preventDefault();
        let cell = this.getClickedCell(e);
        let player = this.board.get(cell.x, cell.y);
        if (player && !this.timer) {
            this.board.clear(cell.x, cell.y);
            this.player = Board.nextPlayer(this.player);
            this.refresh();
        }
    }

    getClickedCell(e) {
        let parent = $('#board').offset();
        let y = Math.floor((e.pageY - parent.top) / this.boardView.cellSize);
        let x = Math.floor((e.pageX - parent.left) / this.boardView.cellSize);
        return {x: x, y: y};
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
            this.lineChart.reset();
            this.iteration = 0;

            this.ai = new MTS_AI(this.board, this.player);
            this.stop = false;
            // this.ai = new MiniMaxAI(this.board, this.player);
            // this.stop = true;

            this.start = new Date().getTime();
            this.confidences = [];
            this.timer = d3.timer(this.onTimer.bind(this));
            $('#analyze > i').attr('class', 'fa fa-stop');
        } else {
            this.stop = true;
        }
    }

    onTimer(elapsed) {
        try {
            let frameStart = new Date().getTime();
            while (new Date().getTime() - frameStart < 50) { //20 fps
                this.ai.step();
                this.iteration++;
            }
            this.aiResult = this.ai.getResult();
            let time = (new Date().getTime() - this.start) / 1000;
            this.barChart.refresh(this.aiResult);
            this.boardView.refresh({move: this.aiResult.moves[0].move, player: this.ai.player});
            this.lineChart.addDataPoint(this.aiResult.confidence);

            $('#iterations').text(this.iteration);
            $('#confidence').text(this.format(this.aiResult.confidence, 2));
            $('#time').text(this.format(time, 2));

            let settings = this.getSettings();
            if (this.stop
                || (this.aiResult.moves.length === 1)
                || (settings.timeout > 0 && elapsed >= settings.timeout * 1000)
                || (settings.confidence > 0 && this.aiResult.confidence >= settings.confidence)
                || (settings.iterations > 0 && this.iteration >= settings.iterations)) {
                // console.log('it/sec', this.iteration / time);
                let cell = this.board.cell(this.aiResult.moves[0].move);
                this.makeMove(cell.x, cell.y);
                this.stopTimer();
            }
        } catch (e) {
            console.error(e);
            this.stopTimer();
        }
    }

    stopTimer() {
        if (this.timer) {
            this.timer.stop();
            this.timer = undefined;
            $('#analyze > i').attr('class', 'fa fa-play');
        }
    }

    format(value: number, digits: number) {
        return value.toFixed(digits);
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
        this.stopTimer();
        let game = $('#game').val();
        if (game == 't') {
            this.board = new TicTacToeBoard();
        } else if (game == 'c') {
            this.board = new ConnectFourBoard();
        }
        this.board.init();
        this.player = 1;
        this.resetState();
    }

    resetState() {
        this.aiResult = undefined;
        this.boardView = new BoardView('#board', this.board);
        this.barChart.refresh();
        this.lineChart.reset();
        this.refresh();
    }

    save() {
        this.stopTimer();
        let state = {
            game: $('#game').val(),
            board: this.board,
            player: this.player
        };
        window.localStorage.setItem("state", JSON.stringify(state));
    }

    load() {
        this.stopTimer();
        let str = window.localStorage.getItem("state");
        if (str) {
            let state = JSON.parse(str);
            $('#game').val(state.game);
            this.player = state.player;
            if (state.game == 't') {
                this.board = new TicTacToeBoard();
            } else if (state.game == 'c') {
                this.board = new ConnectFourBoard();
            }
            this.board.deserialize(state.board);
            this.resetState();
        }
    }

    loadSettings() {
        let str = window.localStorage.getItem("aiSettings");
        if (str) {
            this.aiSettings = JSON.parse(str);
        } else {
            this.aiSettings = _.cloneDeep(this.aiSettingsDefault);
        }
    }

    getSettings() {
        let game = $('#game').val();
        return this.aiSettings[game];
    }

    configure() {
        this.stopTimer();
        let settings = this.getSettings();
        $('#form-timeout').val(settings.timeout);
        $('#form-confidence').val(settings.confidence);
        $('#form-iterations').val(settings.iterations);
        $('#config-dialog').modal();
    }

    formApply() {
        let settings = this.getSettings();
        settings.timeout = $('#form-timeout').val();
        settings.confidence = $('#form-confidence').val();
        settings.iterations = $('#form-iterations').val();
        window.localStorage.setItem("aiSettings", JSON.stringify(this.aiSettings));
        $('#config-dialog').modal('hide');
    }

    formReset() {
        let game = $('#game').val();
        let settings = this.aiSettingsDefault[game];
        $('#form-timeout').val(settings.timeout);
        $('#form-confidence').val(settings.confidence);
        $('#form-iterations').val(settings.iterations);
    }

}

new App().init();