"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectFourBoard_1 = require("../src/ConnectFourBoard");
var AI_1 = require("../src/AI");
describe('AI', function () {
    it('playConnectFour', function () {
        var p1 = 0;
        var p2 = 0;
        var tie = 0;
        for (var i = 0; i < 100; i++) {
            var win = playGame();
            if (win === 1) {
                p1++;
            }
            else if (win === 2) {
                p2++;
            }
            else {
                tie++;
            }
            console.log('p1', p1, 'p2', p2, 'ties', tie);
        }
    });
});
function playGame() {
    var start = new Date().getTime();
    var player = 1;
    var board = new ConnectFourBoard_1.default();
    board.init();
    var iteration = 1;
    while (true) {
        if (board.win) {
            console.log('Player win: ', board.win.player);
            break;
        }
        else if (board.getMoves().length == 0) {
            console.log('Tie!');
            break;
        }
        else {
            iteration++;
            var move = analyze(board, player, iteration);
            board.setIndex(move, player);
            board.findWinner(move);
            player = board.nextPlayer(player);
        }
    }
    var elapsed = new Date().getTime() - start;
    board.print();
    console.log('Game time', elapsed / 1000, 'moves', iteration);
    return board.win.player;
}
function analyze(board, player, move) {
    var iteration = 0;
    var ai = new AI_1.default(board, player);
    var start = new Date().getTime();
    while (true) {
        for (var i = 0; i < 100; i++) {
            ai.step();
            iteration++;
        }
        var aiResult = ai.getResult();
        var confidence = Math.round(aiResult.confidence * 100) / 100;
        var elapsed = new Date().getTime() - start;
        if (elapsed > 5000 || (aiResult.confidence > 2 && iteration > 1000)) {
            console.log('#', move, 'Elapsed', elapsed / 1000, 'Confidence', confidence, 'Iterations', iteration);
            return aiResult.moves[0].move;
        }
    }
}
//# sourceMappingURL=AITest.js.map