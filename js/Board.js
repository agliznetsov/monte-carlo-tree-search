'use strict';

class Board {
    constructor(width = 3, height = 3, winSize = 3) {
        this.cells = {};
        this.width = width;
        this.height = height;
        this.winSize = winSize;
        this.win = undefined;
    }

    nextPlayer(player) {
        return player === 1 ? 2 : 1;
    }

    clone() {
        let board = new Board(this.width, this.height, this.winSize);
        board.cells = Object.assign(board.cells, this.cells);
        return board;
    }

    get(x, y) {
        return this.cells[this.cellIndex(x, y)];
    }

    set(x, y, value) {
        this.cells[this.cellIndex(x, y)] = value;
    }

    cellIndex(x, y) {
        return y * this.width + x;
    }

    movePosition(move) {
        return {
            x: move % this.width,
            y: Math.floor(move / this.width),
        };
    }

    print() {
        for (let y = 0; y < this.height; y++) {
            let str = '';
            for (let x = 0; x < this.width; x++) {
                let cell = this.get(x, y);
                str += cell ? (cell + ' ') : '. ';
            }
            console.log(str);
        }
    }

    findAllMoves() {
        let moves = [];
        let size = this.width * this.height;
        for (let i = 0; i < size; i++) {
            if (!this.cells[i]) {
                moves.push(i);
            }
        }
        return moves;
    }

    makeMove(move, player) {
        if (this.cells[move] && player) {
            throw new Error('Cell (' + move + ') is busy');
        }
        this.cells[move] = player;

    }

    undoMove(move) {
        this.makeMove(move, undefined);
    }

    findWinner(move) {
        let y = Math.floor(move / this.width);
        let x = move % this.width;
        let win = this.checkCell(x, y, -1, 0, 1, 0);
        if (!win) {
            win = this.checkCell(x, y, 0, -1, 0, 1);
        }
        if (!win) {
            win = this.checkCell(x, y, -1, 1, 1, -1);
        }
        if (!win) {
            win = this.checkCell(x, y, -1, -1, 1, 1);
        }
        this.win = win;
        return win;
    }

    checkCell(x, y, dx1, dy1, dx2, dy2) {
        let player = this.get(x, y);
        if (!player) {
            throw new Error('Empty cell at ' + x + ',' + y);
        }
        let length = 0;
        let i = 0;
        let tx = x;
        let ty = y;
        while (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
            if (this.get(tx, ty) === player) {
                length++;
            } else {
                break;
            }
            tx += dx1;
            ty += dy1;
        }
        let tx2 = x + dx2;
        let ty2 = y + dy2;
        while (tx2 >= 0 && tx2 < this.width && ty2 >= 0 && ty2 < this.height) {
            if (this.get(tx2, ty2) === player) {
                length++;
            } else {
                break;
            }
            tx2 += dx2;
            ty2 += dy2;
        }
        if (length >= this.winSize) {
            return {
                player: player,
                start: {x: tx - dx1, y: ty - dy1},
                end: {x: tx2 - dx2, y: ty2 - dy2}
            }
        } else {
            return false;
        }
    }

    randomPlayout(player) {
        let moves = this.findAllMoves();
        while (moves.length) {
            let moveIndex = Math.floor(Math.random() * moves.length);
            let move = moves[moveIndex];
            this.makeMove(move, player);
            let win = this.findWinner(move);
            if (win) {
                return win;
            } else {
                moves.splice(moveIndex, 1);
                player = this.nextPlayer(player);
            }

        }
        return false;
    }

}

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = Board;
}