import * as _ from 'lodash';
import {Board, Win} from "./Board";
let __: any = _; //HACK: to overcome wrong types mapping for lodash

export default class AI {
    private player: number;
    private originalBoard: Board;
    private node: Node;
    private playCount: number;
    private board: Board;

    constructor(board: Board, player: number) {
        this.player = player;
        this.originalBoard = board;
        this.node = new Node(null, Board.nextPlayer(player), null);
        this.playCount = 0;
    }

    step() {
        this.board = this.originalBoard.clone();
        let win = this.selection();
        if (!win) {
            this.expansion();
            win = this.simulation();
        }
        this.backpropogation(win);
        this.playCount++;
        // console.log('# cycle/sec: ', Math.round(1000 * this.node.playCount / (end - start)));
    }

    getResult() {
        let res: any = {};
        let moves: any[];
        moves = _.map(this.node.children, (it: any) => {
            return {move: it.move, value: it.playCount / this.playCount}
        });
        res.max = _.maxBy(moves, 'value').value;
        res.mean = __.meanBy(moves, 'value');
        res.confidence = (res.max - res.mean) / res.mean;
        res.moves = _.orderBy(moves, 'value', 'desc');
        return res;
    }

    selection(): Win {
        if (this.node.parent) {
            throw new Error('invalid start node: ' + this.node);
        }
        while (this.node.children && this.node.children.length) {
            this.node.children.forEach(it => it.calculateUCB(this.node.playCount));
            //let sorted = _.orderBy(this.node.children, 'ucb', 'desc');
            let maxUcb = Number.MIN_VALUE;
            let nextNode;
            this.node.children.forEach(it => {
                if (it.ucb > maxUcb) {
                    maxUcb = it.ucb;
                    nextNode = it;
                }
            });
            this.board.setIndex(nextNode.move, nextNode.player);
            this.node = nextNode;
        }
        if (this.node.move !== null) {
            if (this.node.win === null) {
                this.node.win = this.board.findWinnerAt(this.node.move);
            }
        }
        return this.node.win;
    }

    expansion() {
        if (this.node.children === null) {
            this.node.children = [];
            let moves = this.board.getMoves();
            if (moves.length) {
                let np = Board.nextPlayer(this.node.player);
                moves.forEach(m => this.node.children.push(new Node(this.node, np, m)));
                let moveIndex = Math.floor(Math.random() * this.node.children.length);
                let nextNode = this.node.children[moveIndex];
                this.board.setIndex(nextNode.move, nextNode.player);
                this.node = nextNode;
            }
        }
    }

    simulation(): Win {
        let win = this.board.findWinnerAt(this.node.move);
        if (win) {
            return win;
        } else {
            return this.board.randomPlayout(Board.nextPlayer(this.node.player));
        }
    }

    backpropogation(win) {
        while (true) {
            this.node.playCount++;
            if (win) {
                if (win.player === this.node.player) {
                    this.node.winCount++;
                    // } else {
                    //     this.node.winCount--;
                }
            } else {
                this.node.winCount += 0.5; //half point for a tie
            }
            if (this.node.parent) {
                this.node = this.node.parent;
            } else {
                break;
            }
        }
    }

}

class Node {
    public win: Win = null;
    public parent;
    public player;
    public move;
    public children = null;
    public playCount = 0;
    public winCount = 0;
    public ucb;

    constructor(parent: Node, player: number, move: string) {
        this.parent = parent;
        this.player = player;
        this.move = move;
    }

    calculateUCB(total) {
        const C = 1.4;
        if (this.playCount === 0) {
            this.ucb = Number.MAX_VALUE;
        } else {
            let tmp = (C * Math.sqrt(Math.log(total) / this.playCount));
            this.ucb = this.winCount / this.playCount + tmp;
        }
    }
}
