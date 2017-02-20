const assert = require('assert');
const Board = require('../js/Board');

describe('Board', () => {
    it('cells', () => {
        let board = new Board(10, 10);
        assert.equal(null, board.get(0, 0));
        board.set(0, 0, 1);
        board.set(9, 0, 1);
        board.set(9, 9, 2);
        assert.equal(1, board.get(0, 0));
        assert.equal(2, board.get(9, 9));
    });

    it('findAllMoves', () => {
        let board = new Board(5, 3, 3);
        assert.equal(15, board.findAllMoves().length);
    });

    it('clone', () => {
        let board = new Board(3, 3, 3);
        board.set(0, 0, 1);
        let copy = board.clone();
        copy.set(1, 1, 2);
        assert.equal(undefined, board.get(1, 1));
        assert.equal(1, copy.get(0, 0));
        assert.equal(2, copy.get(1, 1));
    });

    it('wrong move', () => {
        let board = new Board(10, 10);
        board.set(0, 0, 1);
        assert.throws(() => board.makeMove(0, 2));
    });

    it('findWinner empty', () => {
        let board = new Board(10, 10, 2);
        board.set(0, 0, 1);
        assert.equal(false, board.findWinner(0));
    });

    it('findWinner row', () => {
        let board = new Board(10, 10, 2);
        board.set(1, 1, 1);
        board.set(2, 1, 1);
        let res = board.findWinner(board.index(1, 1));
        assert.equal(1, res.player);
        assert.deepEqual({ '11': true, '12': true }, res.cells);
    });

    it('findWinner col', () => {
        let board = new Board(10, 10, 2);
        board.set(1, 1, 1);
        board.set(1, 2, 1);
        let res = board.findWinner(board.index(1, 1));
        assert.equal(1, res.player);
        assert.deepEqual({ '11': true, '21': true }, res.cells);
    });

    it('findWinner diag', () => {
        let board = new Board(10, 10, 3);
        board.set(0, 2, 1);
        board.set(1, 3, 1);
        board.set(2, 4, 1);
        let res = board.findWinner(board.index(0, 2));
        assert.equal(1, res.player);
        assert.deepEqual({ '20': true, '31': true, '42': true }, res.cells);
    });

});