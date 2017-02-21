global._ = require('lodash');

const assert = require('assert');
const Board = require('../js/Board');
const AI = require('../js/AI');


describe('AI', () => {

    it('test', () => {
        let board = new Board(10, 1, 4);
        board.set(0, 0, 1);
        board.set(1, 0, 1);
        board.set(2, 0, 1);

        let ai = new AI(board, 1);
        for(let i=0; i<100; i++) {
            ai.step();
        }
        let res = ai.getResult();
        assert.equal(7, res.moves.length);
        let move = res.moves[0].move;
        assert.equal(3, move);
    });

});