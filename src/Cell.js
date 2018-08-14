import $ from 'jquery';
export default class Cell{
    constructor(board, xIndex, yIndex){
        this.board = board;
        this.x = xIndex;
        this.y = yIndex;

        const pxX = (this.x + 0.5) * Cell.size;
        const pxY = (this.y + 0.5) * Cell.size;
        this.element = $(`
            <div class=board-cell style=left:${pxX}px;top:${pxY}px;>
                <div class=board-cell-inner>

                </div>
            </div>
        `);
        this.element.mouseup((event)=>{
            this.board.tickNumber++;
            this.board.gameRules.cellClick.call(this, this, this.getState(), event);
            this.board.tickNumber--;
            event.preventDefault();
        });

        this.states = {}; // A record of states per tick
        this.state = 1;
    }

    // Stat tracking/altering
    getState(tick){
        return this.states[tick!==undefined?tick:this.tickNumber];
    }
    setState(state){
        if(state!=this.state){
            this.state = state;
            const color = this.board.gameRules.colors[state]||"black";
            this.element.attr("state", state);
        }

        // Track the states
        this.states[this.tickNumber] = state;
        delete this.states[this.tickNumber-2];
    }

    // Game rule related methods
    tick(tick){
        const currentState = this.getState();
        this.tickNumber = tick;
        const state = this.board.gameRules.cellTick.call(this, this, currentState);
        this.setState(state);
    }
    getNeighbor(xOffset, yOffset){
        const xIndex = this.x + xOffset;
        const yIndex = this.y + yOffset;
        return this.board.getCellState(xIndex, yIndex);
    }
    getNeighbors(pattern){
        const cells = [];
        pattern.getCells().forEach(offset=>{
            cells.push(this.getNeighbor(offset.x, offset.y) * offset.multiplier);
        });
        return cells;
    }

    // Just ties in with the css style
    static get size(){
        return 24;
    }
}