import Set from "./Set";

export class Win {
    readonly cells: {[id: string]: number;} = {};
    readonly player: number;

    constructor(cells, player) {
        this.cells = cells;
        this.player = player;
    }
}

export abstract class Board {
    moves = new Set();
    cells: {[id: string]: number;} = {};
    win: Win;
    width: number;
    height: number;
    winSize: number;

    static nextPlayer(player: number): number {
        return player === 1 ? 2 : 1;
    }

    abstract init();

    abstract clone(): Board;

    abstract makeMove(x: number, y: number, player: number): {x: number, y: number};

    protected abstract addMoves(x: number, y: number);

    abstract evaluate(): number;

    resize(width: number, height: number, winSize: number) {
        this.width = width;
        this.height = height;
        this.winSize = winSize;
    }

    deserialize(data) {
        this.width = data.width;
        this.height = data.height;
        this.winSize = data.winSize;
        this.moves = new Set();
        this.moves.deserialize(data.moves);
        this.cells = data.cells;
        this.win = data.win;
    }

    get(x: number, y: number): number {
        if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
            return -1;
        } else {
            return this.cells[this.index(x, y)];
        }
    }

    set(x: number, y: number, value: number) {
        let i = this.index(x, y);
        if (this.cells[i] && value) {
            throw new Error('Cell (' + x + ',' + y + ') is already set');
        }
        this.cells[i] = value;
        this.addMoves(x, y);
    }

    clear(x: number, y: number) {
        let i = this.index(x, y);
        delete this.cells[i];
        this.addMoves(x, y);
    }

    setIndex(move: string, value: number) {
        let c = this.cell(move);
        this.set(c.x, c.y, value);
    }

    index(x: number, y: number): number {
        return y * this.width + x;
    }

    cell(index: string) {
        let num = Number(index);
        return {
            x: num % this.width,
            y: Math.floor(num / this.width),
        };
    }

    print() {
        for (let y = 0; y < this.height; y++) {
            let str = '';
            for (let x = 0; x < this.width; x++) {
                let value = this.get(x, y);
                str += value ? (value + ' ') : '. ';
            }
            console.log(str);
        }
    }

    getMoves(): string[] {
        return this.moves.getKeys();
    }

    randomMove(): string {
        let keys = this.moves.getKeys();
        let moveIndex = Math.floor(Math.random() * keys.length);
        return keys[moveIndex];
    }

    findWinnerAt(move: string) {
        let c = this.cell(move);
        return this.findWinner(c.x, c.y);
    }

    findWinner(x: number, y: number): Win {
        let win = this.checkCell(x, y, -1, 0, 1, 0);
        if (!win) {
            win = this.checkCell(x, y, 0, -1, 0, 1);
        }
        if (!win) {
            win = this.checkCell(x, y, -1, 1, 1, -1);
        }
        if (!win) {
            win = this.checkCell(x, y, -1, -1, 1, 1);
        }
        this.win = win;
        return win;
    }

    private checkCell(x, y, dx1, dy1, dx2, dy2): Win {
        let player = this.get(x, y);
        if (!player) {
            throw new Error('Empty cell at ' + x + ',' + y);
        }
        let length = 0;
        let tx = x;
        let ty = y;
        let cells = {};
        while (tx >= 0 && tx < this.width && ty >= 0 && ty < this.height) {
            if (this.get(tx, ty) === player) {
                length++;
                cells[this.index(tx, ty)] = true;
            } else {
                break;
            }
            tx += dx1;
            ty += dy1;
        }
        let tx2 = x + dx2;
        let ty2 = y + dy2;
        while (tx2 >= 0 && tx2 < this.width && ty2 >= 0 && ty2 < this.height) {
            if (this.get(tx2, ty2) === player) {
                length++;
                cells[this.index(tx2, ty2)] = true;
            } else {
                break;
            }
            tx2 += dx2;
            ty2 += dy2;
        }
        if (length >= this.winSize) {
            return new Win(cells, player);
        } else {
            return null;
        }
    }

    randomPlayout(player: number): Win {
        while (true) {
            let moves = this.getMoves();
            if (moves.length == 0) {
                break;
            }
            let moveIndex = Math.floor(Math.random() * moves.length);
            let move: any = moves[moveIndex];
            let c = this.cell(move);
            this.set(c.x, c.y, player);
            let win = this.findWinner(c.x, c.y);
            if (win) {
                return win;
            } else {
                player = Board.nextPlayer(player);
            }
        }
        return null;
    }

}
