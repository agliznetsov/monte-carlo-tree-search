"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var TicTacToeBoard_1 = require("../src/TicTacToeBoard");
describe('TicTacToeBoard', function () {
    it('cells', function () {
        var board = new TicTacToeBoard_1.default();
        assert.equal(null, board.get(0, 0));
        board.set(0, 0, 1);
        board.set(9, 0, 1);
        board.set(9, 9, 2);
        assert.equal(1, board.get(0, 0));
        assert.equal(2, board.get(9, 9));
    });
    it('getMoves', function () {
        var board = new TicTacToeBoard_1.default();
        board.resize(5, 5, 5);
        board.init();
        var moves = board.getMoves();
        assert.equal(1, moves.length);
        assert.equal(12, moves[0]);
        board.setIndex(moves[0], 1);
        moves = board.getMoves();
        assert.equal(8, moves.length);
    });
    it('findAllMoves', function () {
        var board = new TicTacToeBoard_1.default();
        board.resize(5, 5, 5);
        assert.equal(25, board.findAllMoves().length);
    });
    it('clone', function () {
        var board = new TicTacToeBoard_1.default();
        board.set(0, 0, 1);
        var copy = board.clone();
        copy.set(1, 1, 2);
        assert.equal(board.get(1, 1), undefined);
        assert.equal(copy.get(0, 0), 1);
        assert.equal(copy.get(1, 1), 2);
    });
    it('wrong move', function () {
        var board = new TicTacToeBoard_1.default();
        board.set(0, 0, 1);
        assert.throws(function () { return board.set(0, 0, 2); });
        assert.throws(function () { return board.setIndex("0", 2); });
    });
    it('findWinner empty', function () {
        var board = new TicTacToeBoard_1.default();
        board.resize(10, 10, 2);
        board.set(0, 0, 1);
        assert.equal(null, board.findWinner(0, 0));
    });
    it('findWinner row', function () {
        var board = new TicTacToeBoard_1.default();
        board.resize(10, 10, 2);
        board.set(1, 1, 1);
        board.set(2, 1, 1);
        var res = board.findWinner(1, 1);
        assert.equal(1, res.player);
        assert.deepEqual({ '11': true, '12': true }, res.cells);
    });
    it('findWinner col', function () {
        var board = new TicTacToeBoard_1.default();
        board.resize(10, 10, 2);
        board.set(1, 1, 1);
        board.set(1, 2, 1);
        var res = board.findWinner(1, 1);
        assert.equal(1, res.player);
        assert.deepEqual({ '11': true, '21': true }, res.cells);
    });
    it('findWinner diag', function () {
        var board = new TicTacToeBoard_1.default();
        board.resize(10, 10, 3);
        board.set(0, 2, 1);
        board.set(1, 3, 1);
        board.set(2, 4, 1);
        var res = board.findWinner(0, 2);
        assert.equal(1, res.player);
        assert.deepEqual({ '20': true, '31': true, '42': true }, res.cells);
    });
    it('evaluate', function () {
        evaluate(".1.", 0);
        evaluate(".11.", 2);
        evaluate(".111.", 4);
        evaluate(".1111.", 8);
        evaluate(".11111.", 1000000);
        evaluate(".22222.", -1000000);
        evaluate("11.............", 1);
        evaluate(".............11", 1);
        evaluate(".112...........", 1);
        evaluate(".1122..........", 0);
    });
    function evaluate(str, expected) {
        var board = new TicTacToeBoard_1.default();
        for (var i = 0; i < str.length; i++) {
            var ch = str.charAt(i);
            if (ch === '1' || ch === '2') {
                var p = Number(ch);
                board.set(i, 0, p);
            }
        }
        var actual = board.evaluate();
        assert.equal(actual, expected);
    }
});
//# sourceMappingURL=TicTacToeBoardTest.js.map