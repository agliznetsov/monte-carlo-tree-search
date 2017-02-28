import * as _ from 'lodash';
import {Board} from "./Board";

export default class TicTacToeBoard extends Board {

    constructor() {
        super();
        this.resize(15, 15, 5);
    }

    init() {
        this.moves[this.index(Math.floor(this.width / 2), Math.floor(this.height / 2))] = true;
    }

    clone() {
        let board = new TicTacToeBoard();
        board.resize(this.width, this.height, this.winSize);
        board.cells = _.clone(this.cells);
        board.moves = _.clone(this.moves);
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

}
