class App {
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
        if (!this.board.win && !this.board.get(x, y)) {
            this.makeMove(this.board.index(x, y));
            if (!this.board.win) {
                this.analyze();
            }
            //this.refresh();
        }
    }

    makeMove(move) {
        this.board.setIndex(move, this.player);
        this.board.findWinner(move);
        if (!this.board.win) {
            this.player = this.board.nextPlayer(this.player);
        }
        this.refresh();
    }

    analyze() {
        if (!this.timer) {
            $('#analyze > i').attr('class', 'fa fa-pause');
            this.lineChart.reset();
            let that = this;
            that.iteration = 0;
            that.ai = new AI(this.board, this.player);
            that.stop = false;
            let start = new Date().getTime();
            that.confidences = [];
            this.timer = d3.timer(function (elapsed) {
                let frameStart = new Date().getTime();
                //while (new Date().getTime() - frameStart < 40) { //25 fps
                for (let i = 0; i < 100; i++) {
                    that.ai.step();
                    that.iteration++;
                }
                that.aiResult = that.ai.getResult();
                that.barChart.refresh(that.aiResult);
                $('#iterations').text(that.iteration);
                $('#confidence').text(Math.round(that.aiResult.confidence * 100) / 100);
                that.lineChart.addDataPoint(that.aiResult.confidence);
                that.confidences.push(Math.round(that.aiResult.confidence * 100) / 100);
                let std = that.drawConfidenceLine();
                if (elapsed > 15000 || that.stop || (that.aiResult.confidence > 2) || (std > -1 && std < 0.03 && that.iteration > 1000)) {
                    that.timer.stop();
                    that.timer = undefined;
                    let took = new Date().getTime() - start;
                    console.log('Took', took / 1000, 'Analyze rate, iterations/sec:', Math.round(that.iteration * 1000 / took));
                    $('#analyze > i').attr('class', 'fa fa-play');
                    that.makeMove(that.aiResult.moves[0].move);
                }
            });
        } else {
            this.stop = true;
        }
    }

    drawConfidenceLine() {
        if (this.confidences.length >= 20) {
            let arr = this.confidences.slice(this.confidences.length - 20, -1);
            let mean = _.mean(arr);
            let variance = _.sumBy(arr, it => Math.pow(it - mean, 2)) / arr.length;
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
            .classed("win", (d) => that.board.win)
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

            // this.board.set(2, 2, 2);
            // this.board.set(2, 3, 2);
            // this.board.set(2, 1, 2);
            // this.board.set(3, 3, 2);

            // this.board.set(3, 3, 1);
            // this.board.set(2, 2, 1);
            // this.board.set(3, 2, 2);

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