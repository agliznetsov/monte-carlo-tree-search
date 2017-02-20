class App {
    init() {
        $('#restart').click(this.restart.bind(this));
        $('#help').click(this.help.bind(this));
        this.restart();
    }

    onClick(x, y) {
        if (!this.board.win && !this.board.get(x, y)) {
            this.makeMove(this.board.index(x, y));
            if (!this.board.win) {
                //this.findMove();
            }
            this.refresh();
        }
    }

    help() {
        let ai = new AI(this.board, this.player);
        //this.moves = ai.findMove();
        //this.render();
        let start = new Date().getTime();
        let counter = 0;
        let timer = setInterval(() => {
            ai.step();
            // $('#help').html('' + counter);
            let now = new Date().getTime();
            clearInterval(timer);
        }, 0);
    }

    makeMove(move) {
        this.board.setIndex(move, this.player);
        this.board.findWinner(move);
        if (!this.board.win) {
            this.player = this.board.nextPlayer(this.player);
        }
    }

    findMove() {
        // var t = d3.timer(function(elapsed) {
        //     console.log(elapsed);
        //     new BarChart(d3.select('#moves-chart'));
        //     //if (elapsed > 1000)
        //         t.stop();
        // });

        let ai = new AI(this.board, this.player);
        this.moves = ai.findMove();
        if (this.moves.length) {
            this.makeMove(this.moves[0].move);
        }
    }

    refresh() {
        this.boardView.refresh();
        let that = this;
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
        } else if (game == 't5') {
            this.board = new Board(10, 10, 5);
        }
        this.player = 1;
        this.moves = undefined;
        this.boardView = new BoardView('#board', this.board, this.onClick.bind(this));
        this.refresh();
    }

}

new App().init();