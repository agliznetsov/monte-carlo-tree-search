"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var ConnectFourBoard_1 = require("../src/ConnectFourBoard");
describe('ConnectFourBoard', function () {
    it('getMoves', function () {
        var board = new ConnectFourBoard_1.default();
        board.init();
        var moves = board.getMoves();
        assert.equal(moves.length, 7);
        board.set(3, 5, 1);
        moves = board.getMoves();
        assert.equal(moves.length, 7);
        assert.equal(moves[0], "31");
    });
});
//# sourceMappingURL=ConnectFourBoardTest.js.map