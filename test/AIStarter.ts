import ConnectFourBoard from '../src/ConnectFourBoard';
import {Board} from "../src/Board";
import {MTS_AI} from "../src/AI";


describe('AI', () => {

    it('playConnectFour', () => {
        let p1 = 0;
        let p2 = 0;
        let tie = 0;
        for (let i = 0; i < 100; i++) {
            let win = playGame();
            if (win === 1) {
                p1++;
            } else if (win === 2) {
                p2++;
            } else {
                tie++;
            }
            console.log('p1', p1, 'p2', p2, 'ties', tie);
        }
    });

});

function playGame() {
    let start = new Date().getTime();
    let player = 1;
    let board = new ConnectFourBoard();
    board.init();
    let iteration = 1;
    let win = null;
    while (true) {
        if (win) {
            console.log('Player win: ', win.player);
            break;
        } else if (board.getMoves().length == 0) {
            console.log('Tie!');
            break;
        } else {
            iteration++;
            let move = analyze(board, player, iteration);
            let cell = board.cell(move);
            board.set(cell.x, cell.y, player);
            win = board.findWinner(cell.x, cell.y);
            player = Board.nextPlayer(player);
        }
    }
    let elapsed = new Date().getTime() - start;
    board.print();
    console.log('Game time', elapsed / 1000, 'moves', iteration);

    return win.player;
}

function analyze(board, player, move) {
    let iteration = 0;
    let ai = new MTS_AI(board, player);
    let start = new Date().getTime();
    while (true) {
        for (let i = 0; i < 100; i++) {
            ai.step();
            iteration++;
        }

        let aiResult = ai.getResult();
        let confidence = Math.round(aiResult.confidence * 100) / 100;

        let elapsed = new Date().getTime() - start;
        if (elapsed > 5000 || (aiResult.confidence > 2 && iteration > 1000)) {
            console.log('#', move, 'Elapsed', elapsed / 1000, 'Confidence', confidence, 'Iterations', iteration);
            return aiResult.moves[0].move;
        }
    }
}
