import * as assert from 'assert';

import TicTacToeBoard from '../src/TicTacToeBoard';

describe('Board', () => {
    it('cells', () => {
        let board = new TicTacToeBoard(10, 10);
        assert.equal(null, board.get(0, 0));
        board.set(0, 0, 1);
        board.set(9, 0, 1);
        board.set(9, 9, 2);
        assert.equal(1, board.get(0, 0));
        assert.equal(2, board.get(9, 9));
    });

    it('getMoves', () => {
        let board = new TicTacToeBoard(5, 5);
        board.init();
        let moves = board.getMoves();
        assert.equal(1, moves.length);
        assert.equal(12, moves[0]);

        board.setIndex(moves[0], 1);
        moves = board.getMoves();
        assert.equal(8, moves.length);
    });

    it('findAllMoves', () => {
        let board = new TicTacToeBoard(5, 3, 3);
        assert.equal(15, board.findAllMoves().length);
    });

    it('clone', () => {
        let board = new TicTacToeBoard(3, 3, 3);
        board.set(0, 0, 1);
        let copy = board.clone();
        copy.set(1, 1, 2);
        assert.equal(board.get(1, 1), undefined);
        assert.equal(copy.get(0, 0), 1);
        assert.equal(copy.get(1, 1), 2);
    });

    it('wrong move', () => {
        let board = new TicTacToeBoard(10, 10);
        board.set(0, 0, 1);
        assert.throws(() => board.setIndex(0, 2));
    });

    it('findWinner empty', () => {
        let board = new TicTacToeBoard(10, 10, 2);
        board.set(0, 0, 1);
        assert.equal(false, board.findWinner(0));
    });

    it('findWinner row', () => {
        let board = new TicTacToeBoard(10, 10, 2);
        board.set(1, 1, 1);
        board.set(2, 1, 1);
        let res:any = board.findWinner(board.index(1, 1));
        assert.equal(1, res.player);
        assert.deepEqual({ '11': true, '12': true }, res.cells);
    });

    it('findWinner col', () => {
        let board = new TicTacToeBoard(10, 10, 2);
        board.set(1, 1, 1);
        board.set(1, 2, 1);
        let res:any = board.findWinner(board.index(1, 1));
        assert.equal(1, res.player);
        assert.deepEqual({ '11': true, '21': true }, res.cells);
    });

    it('findWinner diag', () => {
        let board = new TicTacToeBoard(10, 10, 3);
        board.set(0, 2, 1);
        board.set(1, 3, 1);
        board.set(2, 4, 1);
        let res:any = board.findWinner(board.index(0, 2));
        assert.equal(1, res.player);
        assert.deepEqual({ '20': true, '31': true, '42': true }, res.cells);
    });

});