class AI {
    constructor(board, player) {
        this.player = player;
        this.originalBoard = board;
        this.node = new Node(undefined, board.nextPlayer(player), undefined);
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
        let res = {};
        res.moves = _.map(this.node.children, (it) => {
            return {move: it.move, value: it.playCount / this.playCount}
        });
        res.max = _.maxBy(res.moves, 'value').value;
        res.mean = _.meanBy(res.moves, 'value');
        res.confidence = (res.max - res.mean) / res.mean;
        res.moves = _.orderBy(res.moves, 'value', 'desc');
        return res;
    }

    selection() {
        if (this.node.parent) {
            throw new Error('invalid start node', this.node);
        }
        while (this.node.children && this.node.children.length) {
            this.node.children.forEach(it => it.calculateUCB(this.node.playCount));
            let sorted = _.orderBy(this.node.children, 'ucb', 'desc');
            let nextNode = sorted[0];
            this.board.setIndex(nextNode.move, nextNode.player);
            this.node = nextNode;
        }
        if (this.node.move !== undefined) {
            if (this.node.win === undefined) {
                this.node.win = this.board.findWinner(this.node.move);
            }
        }
        return this.node.win;
    }

    expansion() {
        if (this.node.children === null) {
            this.node.children = [];
            let moves = this.board.getMoves();
            if (moves.length) {
                let np = this.board.nextPlayer(this.node.player);
                moves.forEach(m => this.node.children.push(new Node(this.node, np, m)));
                let moveIndex = Math.floor(Math.random() * this.node.children.length);
                let nextNode = this.node.children[moveIndex];
                this.board.setIndex(nextNode.move, nextNode.player);
                this.node = nextNode;
            }
        }
    }

    simulation() {
        let win = this.board.findWinner(this.node.move);
        if (win) {
            return win;
        } else {
            return this.board.randomPlayout(this.board.nextPlayer(this.node.player));
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
    constructor(parent, player, move) {
        this.parent = parent;
        this.children = null;
        this.player = player;
        this.move = move;
        this.playCount = 0;
        this.winCount = 0;
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

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = AI;
}