import * as _ from 'lodash';
import {Board} from "./Board";

export default class TicTacToeBoard extends Board {

    constructor() {
        super();
        this.resize(15, 15, 5);
    }

    init() {
        let center = this.index(Math.floor(this.width / 2), Math.floor(this.height / 2));
        this.moves.add(center);
    }

    clone() {
        let board = new TicTacToeBoard();
        board.resize(this.width, this.height, this.winSize);
        board.cells = _.clone(this.cells);
        board.moves = this.moves.clone();
        return board;
    }

    makeMove(x: number, y: number, player: number) {
        this.set(x, y, player);
        return {x: x, y: y};
    }

    protected addMoves(cx: number, cy: number) {
        const rad = 1;
        let x1 = Math.max(0, cx - rad);
        let y1 = Math.max(0, cy - rad);
        let x2 = Math.min(this.width - 1, cx + rad);
        let y2 = Math.min(this.height - 1, cy + rad);
        for (let x = x1; x <= x2; x++) {
            for (let y = y1; y <= y2; y++) {
                let i = this.index(x, y);
                if (!this.cells[i]) {
                    this.moves.add(i);
                } else {
                    this.moves.remove(i);
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


    evaluate(): number {
        let value = 0;

        for (let y = 0; y < this.height; y++) {
            value += this.evaluateRow(0, y, 1, 0);
        }

        for (let x = 0; x < this.width; x++) {
            value += this.evaluateRow(x, 0, 0, 1);
        }

        for (let y = 0; y < this.height; y++) {
            value += this.evaluateRow(0, y, 1, -1);
        }
        for (let x = 1; x < this.width; x++) {
            value += this.evaluateRow(x, this.height - 1, 1, -1);
        }

        for (let y = 0; y < this.height; y++) {
            value += this.evaluateRow(0, y, 1, 1);
        }
        for (let x = 1; x < this.width; x++) {
            value += this.evaluateRow(x, 0, 1, 1);
        }

        return value;
    }

    private evaluateRow(x: number, y: number, dx: number, dy: number): number {
        let value = 0;
        let left = this.get(x - dx, y - dy);
        let player = undefined;
        let length = 1;
        while (true) {
            let current = this.get(x, y);
            if (current && current === player) {
                length++;
            } else {
                if (length > 1) {
                    value += this.evaluateSequence(player, length, left, current);
                    player = current;
                    length = 1;
                    left = this.get(x - dx, y - dy);
                } else if (current) {
                    player = current;
                    length = 1;
                    left = this.get(x - dx, y - dy);
                }
            }
            x += dx;
            y += dy;
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                if (length > 1) {
                    value += this.evaluateSequence(player, length, left, current);
                }
                break;
            }
        }
        return value;
    }

    private evaluateSequence(player, length, left, right): number {
        let res = 0;
        if (length >= 5) {
            res = 1000000;
        } else if (length === 4) {
            if (left === undefined && right === undefined) {
                res = 8;
            } else if (left === undefined || right === undefined) {
                res = 4;
            }
        } else if (length === 3) {
            if (left === undefined && right === undefined) {
                res = 4;
            } else if (left === undefined || right === undefined) {
                res = 2;
            }
        } else if (length === 2) {
            if (left === undefined && right === undefined) {
                res = 2;
            } else if (left === undefined || right === undefined) {
                res = 1;
            }
        }
        return player == 1 ? res : -res;
    }

}
