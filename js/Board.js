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
        return this.cells[this.index(x, y)];
    }

    set(x, y, value) {
        this.setIndex(this.index(x, y), value);
    }

    setIndex(index, value) {
        if (this.cells[index] && value) {
            throw new Error('Cell (' + move + ') is already set');
        }
        this.cells[index] = value;
    }

    index(x, y) {
        return y * this.width + x;
    }

    cell(index) {
        return {
            x: index % this.width,
            y: Math.floor(index / this.width),
        };
    }

    print() {
        for (let y = 0; y < this.height; y++) {
            let str = '';
            for (let x = 0; x < this.width; x++) {
                let value = this.get(x, y);
                str += value ? (value + ' ') : '. ';
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

    findWinner(index) {
        let c = this.cell(index);
        let win = this.checkCell(c.x, c.y, -1, 0, 1, 0);
        if (!win) {
            win = this.checkCell(c.x, c.y, 0, -1, 0, 1);
        }
        if (!win) {
            win = this.checkCell(c.x, c.y, -1, 1, 1, -1);
        }
        if (!win) {
            win = this.checkCell(c.x, c.y, -1, -1, 1, 1);
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
        let cells = {};
        while (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
            if (this.get(tx, ty) === player) {
                length++;
                cells[this.index(tx, ty)] = true;
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
                cells[this.index(tx2, ty2)] = true;
            } else {
                break;
            }
            tx2 += dx2;
            ty2 += dy2;
        }
        if (length >= this.winSize) {
            return {
                player: player,
                cells: cells
            };
        } else {
            return false;
        }
    }

    randomPlayout(player) {
        let moves = this.findAllMoves();
        while (moves.length) {
            let moveIndex = Math.floor(Math.random() * moves.length);
            let move = moves[moveIndex];
            this.setIndex(move, player);
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