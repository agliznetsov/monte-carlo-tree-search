import ConnectFourBoard from '../src/ConnectFourBoard';
import TicTacToeBoard from '../src/TicTacToeBoard';
import {Board} from "../src/Board";
import {MTS_AI} from "../src/AI";


describe('AI', () => {

    it('playConnectFour', () => {
        playEpoch(() => new ConnectFourBoard());
    });

    it('playTTC', () => {
        playEpoch(() => {
            let board = new TicTacToeBoard();
            board.resize(3,3,3);
            return board;
        }, 10, 100);
    });

});

function playEpoch(createBoard, games = 100, maxIterations = null) {
    let p1 = 0;
    let p2 = 0;
    let tie = 0;
    for (let i = 0; i < games; i++) {
        let win = playGame(createBoard, maxIterations);
        if (win === 1) {
            p1++;
        } else if (win === 2) {
            p2++;
        } else {
            tie++;
        }
        console.log('p1', p1, 'p2', p2, 'ties', tie);
    }
}

function playGame(createBoard, maxIterations) {
    let start = new Date().getTime();
    let player = 1;
    let board = createBoard();
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
            let move;
            if (player === 1) {
                move = analyze(board, player, iteration, maxIterations);
            } else {
                move = board.randomMove();
            }
            let cell = board.cell(move);
            board.set(cell.x, cell.y, player);
            win = board.findWinner(cell.x, cell.y);
            player = Board.nextPlayer(player);
        }
    }
    let elapsed = new Date().getTime() - start;
    board.print();
    console.log('Game time', elapsed / 1000, 'moves', iteration);

    return win ? win.player : null;
}

function analyze(board, player, move, maxIterations, debug = false) {
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
        if (elapsed > 5000 || (aiResult.confidence > 2 && iteration > 1000) || (maxIterations && iteration >= maxIterations)) {
            if (debug) {
                console.log('#', move, 'Elapsed', elapsed / 1000, 'Confidence', confidence, 'Iterations', iteration);
            }
            return aiResult.moves[0].move;
        }
    }
}
