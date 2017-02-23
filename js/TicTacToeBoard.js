'use strict';

class TicTacToeBoard {
    constructor(width = 3, height = 3, winSize = 3) {
        this.cells = {};
        this.width = width;
        this.height = height;
        this.winSize = winSize;
        this.win = undefined;
        this.moves = {};
    }

    init() {
        this.moves[this.index(Math.floor(this.width/2), Math.floor(this.height/2))] = true;
    }

    nextPlayer(player) {
        return player === 1 ? 2 : 1;
    }

    clone() {
        let board = new TicTacToeBoard(this.width, this.height, this.winSize);
        board.cells = Object.assign(board.cells, this.cells);
        board.moves = Object.assign(board.moves, this.moves);
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
            throw new Error('Cell (' + index + ') is already set');
        }
        this.cells[index] = value;
        this.addMoves(index);
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

    getMoves() {
        return _.keys(this.moves);
    }

    addMoves(index) {
        const rad = 1;
        let c = this.cell(index);
        let x1 = Math.max(0, c.x - rad);
        let y1 = Math.max(0, c.y - rad);
        let x2 = Math.min(this.width - 1, c.x + rad);
        let y2 = Math.min(this.height - 1, c.y + rad);
        for(let x = x1; x <= x2; x++) {
            for(let y = y1; y <= y2; y++) {
                let i = this.index(x, y);
                if (!this.cells[i]) {
                    this.moves[i] = true;
                } else {
                    delete this.moves[i];
                }
            }
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

    // randomPlayout(player) {
    //     let moves = this.findAllMoves();
    //     while (moves.length) {
    //         let moveIndex = Math.floor(Math.random() * moves.length);
    //         let move = moves[moveIndex];
    //         this.setIndex(move, player);
    //         let win = this.findWinner(move);
    //         if (win) {
    //             return win;
    //         } else {
    //             player = this.nextPlayer(player);
    //         }
    //     }
    //     return false;
    // }

    randomPlayout(player) {
        while (true) {
            let moves = this.getMoves();
            if (moves.length == 0) {
                break;
            }
            let moveIndex = Math.floor(Math.random() * moves.length);
            let move = moves[moveIndex];
            this.setIndex(move, player);
            let win = this.findWinner(move);
            if (win) {
                return win;
            } else {
                player = this.nextPlayer(player);
            }
        }
        return false;
    }

}

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = TicTacToeBoard;
}