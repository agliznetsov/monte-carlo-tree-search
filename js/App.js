class App {
    init() {
        $('#restart').click(this.restart.bind(this));
        $('#analyze').click(this.analyze.bind(this));
        MessageBus.get().subscribe('move-selected', (e) => this.onMoveSelected(e));
        this.barChart = new BarChart('#moves-chart');
        this.lineChart = new LineChart('#line-chart');
        this.restart();
    }

    onMoveSelected(move) {
        if (move >= 0) {
            this.boardView.refresh({move: move, player: this.player});
        } else {
            this.boardView.refresh();
        }
    }

    onClick(x, y) {
        if (!this.board.win && !this.board.get(x, y)) {
            this.makeMove(this.board.index(x, y));
            if (!this.board.win) {
                //this.analyze();
            }
            this.refresh();
        }
    }

    makeMove(move) {
        this.board.setIndex(move, this.player);
        this.board.findWinner(move);
        if (!this.board.win) {
            this.player = this.board.nextPlayer(this.player);
        }
    }

    analyze() {
        if (!this.timer) {
            console.log('timer start');
            $('#analyze > i').attr('class', 'fa fa-pause');
            this.lineChart.reset();
            let that = this;
            that.iteration = 0;
            that.ai = new AI(this.board, this.player);
            that.stop = false;
            let start = new Date().getTime();
            this.timer = d3.timer(function (elapsed) {
                let frameStart = new Date().getTime();
                while (new Date().getTime() - frameStart < 40) { //25 fps
                    that.ai.step();
                    that.iteration++;
                }
                let aiResult = that.ai.getResult();
                that.barChart.refresh(aiResult);
                let confidence = (aiResult.max - aiResult.mean) / aiResult.mean;
                $('#iterations').text(that.iteration);
                $('#confidence').text(Math.round(confidence * 100) / 100);
                try {
                    that.lineChart.addDataPoint(confidence);
                } catch (e) {
                    console.error(e);
                }
                if (that.stop || confidence > 2) {
                    that.timer.stop();
                    that.timer = undefined;
                    let took = new Date().getTime() - start;
                    console.log('Took', took / 1000, 'Analyze rate, iterations/sec:', Math.round(that.iteration * 1000 / took));
                    $('#analyze > i').attr('class', 'fa fa-play');
                }
            });
        } else {
            this.stop = true;
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
        if (game == 't4') {
            this.board = new Board(6, 6, 4);
            //this.board.set(2, 2, 1);

            // this.board.setIndex(1, 1);
            // this.board.setIndex(2, 1);
            // this.board.setIndex(3, 1);
            //
            // this.board.setIndex(7, 2);
            // this.board.setIndex(8, 2);
            // this.board.setIndex(9, 2);
        } else if (game == 't5') {
            this.board = new Board(10, 10, 5);
        }
        this.player = 1;
        this.moves = undefined;
        this.boardView = new BoardView('#board', this.board, this.onClick.bind(this));
        this.barChart.refresh();
        this.refresh();
        this.lineChart.reset();
    }

}

new App().init();