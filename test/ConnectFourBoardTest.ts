import * as assert from 'assert';

import ConnectFourBoard from '../src/ConnectFourBoard';

describe('ConnectFourBoard', () => {

    it('getMoves', () => {
        let board = new ConnectFourBoard();

        board.init();
        let moves = board.getMoves();
        assert.equal(moves.length, 7);

        board.set(3, 5, 1);
        moves = board.getMoves();
        assert.equal(moves.length, 7);
        assert.equal(moves[0], "31");
    });

});