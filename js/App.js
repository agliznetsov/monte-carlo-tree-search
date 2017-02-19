class App {
    static renderPlayer(player) {
        let icon = 'fa ' + 'fa-' + (player === 1 ? 'times' : 'circle-o');
        return player ? '<i class="' + icon + '"></i>' : '';
    };

    init() {
        // $('#size').val(5);
        // $('#win-size').val(4);
        // $('#board').click(this.onClick.bind(this));
        $('#restart').click(this.restart.bind(this));
        $('#help').click(this.help.bind(this));
        this.restart();
    }

    onClick(e) {
        if (e.target.id && !this.board.win) {
            this.moves = undefined;
            let move = Number(e.target.id.replace('move', ''));
            this.makeMove(move);
            if (!this.board.win) {
                this.findMove();
            }
            this.render();
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
        this.board.makeMove(move, this.player);
        this.board.findWinner(move);
        if (!this.board.win) {
            this.player = this.board.nextPlayer(this.player);
        }
    }

    findMove() {
        let ai = new AI(this.board, this.player);
        this.moves = ai.findMove();
        if (this.moves.length) {
            this.makeMove(this.moves[0].move);
        }
    }

    render() {
        let win = this.board.win;
        this.renderBoard(win);
        $('#player').html('Player: ' + App.renderPlayer(this.player)  + (win ? ' Wins!' : ''));
        let winLine = $('#win');
        if (win) {
            winLine.removeClass('hidden', win);
            winLine.html('<line x1=' + (win.start.x * 33 + 17) +' y1= ' + (win.start.y * 33 + 17) + ' x2= ' + (win.end.x * 33 + 17) + ' y2= ' + (win.end.y * 33 + 17) +'/>');
        } else {
            winLine.addClass('hidden', win);
        }
    }

    renderBoard(win) {
        let colors = {};
        if (this.moves && this.moves.length) {
            let bestMove = this.moves[0];
            this.moves.forEach((it) => {
                colors[it.move] = 255 - Math.floor(it.playCount * 255 / bestMove.playCount);
            });
        }
        for (let i = 0; i < this.board.width * this.board.height; i++) {
            let value = this.board.cells[i];
            let button = $('#move' + i);
            button.html(App.renderPlayer(value));
            button.attr('disabled', value || win);
            let color = colors[i];
            if (color >= 0) {
                button.attr('style', 'background-color: rgb(' + color + ',' + color + ',' + color + ')');
            } else {
                button.attr('style', '');
            }
        }
    }

    restart() {
        // let size = Number($('#size').val());
        // let winSize = Number($('#win-size').val());
        this.board = new Board(10, 10, 4);
        this.board.set(5,5, 1);
        this.board.set(4,5, 2);
        this.player = 1;
        this.moves = undefined;
        new BoardView('#board', this.board);
        //
        // let boardHtml = '';
        // for (let y = 0; y < this.board.height; y++) {
        //     boardHtml += '<div class="board-row">';
        //     for (let x = 0; x < this.board.width; x++) {
        //         let move = this.board.cellIndex(x, y);
        //         boardHtml += '<button class="square" id="move' + move + '"></button>';
        //     }
        //     boardHtml += '</div>';
        // }
        // $('#board').html(boardHtml);
        // this.render();

        var t = d3.timer(function(elapsed) {
            console.log(elapsed);
            new BarChart(d3.select('#moves-chart'));
            //if (elapsed > 1000)
                t.stop();
        });


    }

}

new App().init();