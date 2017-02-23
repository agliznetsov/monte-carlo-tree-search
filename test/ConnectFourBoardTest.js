global._ = require('lodash');

const assert = require('assert');
const ConnectFourBoard = require('../js/ConnectFourBoard');

describe('Board', () => {

    it('getMoves', () => {
        let board = new ConnectFourBoard();

        board.init();
        let moves = board.getMoves();
        assert.equal(moves.length, 7);

        board.set(3, 5, 1);
        moves = board.getMoves();
        assert.equal(moves.length, 7);
    });

});