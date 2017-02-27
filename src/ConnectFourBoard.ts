import * as _ from "lodash";
import {Board} from "./Board";

export default class ConnectFourBoard extends Board {

    constructor() {
        super(7, 6, 4);
    }

    init() {
        for (let x = 0; x < this.width; x++) {
            this.moves[this.index(x, this.height - 1)] = true;
        }
    }

    clone() {
        let copy = new ConnectFourBoard();
        copy.cells = _.clone(this.cells);
        copy.moves = _.clone(this.moves);
        return copy;
    }

    makeMove(x: number, y: number, player: number) {
        for (let i = this.height - 1; i >= 0; i--) {
            if (!this.get(x, i)) {
                this.set(x, i, player);
                return {x: x, y: i};
            }
        }
        return null;
    }

    protected addMoves(x: number, y: number) {
        let index = this.index(x, y);
        delete this.moves[index];
        if (y > 0) {
            this.moves[this.index(x, y - 1)] = true;
        }
    }

}