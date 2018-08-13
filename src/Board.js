import $ from 'jquery';
import Cell from "./Cell";

export default class Board{
    constructor(width, height, gameRules){
        this.width = width;
        this.height = height;
        this.speed = 20;
        
        // Set up the element
        const pxWidth = width * Cell.size;
        const pxHeight = height * Cell.size;
        this.element = $(`
        <div class=board style=width:${pxWidth}px;height:${pxHeight}px>
        
        </div>
        `);
        
        // Init cells
        this.cells = {};
        for(let x=0; x<width; x++){
            this.cells[x] = {};
            for(let y=0; y<height; y++){
                const cell = new Cell(this, x, y);;
                this.cells[x][y] = cell
                this.element.append(cell.element);
            }
        }

        // Attach this to methods
        this.update = this.update.bind(this);

        // Set up the game rules
        this.setGameRules(gameRules);
    }
    setGameRules(gameRules){
        this.tickNumber = -1;
        if(this.gameRules) this.gameRules.style.remove();
        this.gameRules = gameRules;
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                const cell = this.cells[x][y];
                cell.tickNumber = this.tickNumber;
                cell.setState(gameRules.startState);
            }
        }
        this.element.prepend(gameRules.style);
    }

    // Game rules related methods
    tick(){
        this.tickNumber++;
        for(let x=0; x<this.width; x++){
            for(let y=0; y<this.height; y++){
                const cell = this.cells[x][y];
                cell.tick(this.tickNumber);
            }
        }
        this.gameRules.tick.call(this, this);
    }
    getCellState(xIndex, yIndex){
        const cell = this.getCell(xIndex, yIndex);
        if(cell) return cell.getState(this.tickNumber-1);
        return this.gameRules.edgeState;
    }
    getCell(xIndex, yIndex){
        if(this.gameRules.wrapping){
            xIndex = (xIndex + this.width) % this.width;
            yIndex = (yIndex + this.height) % this.height;
        }
        if(xIndex>=0 && yIndex>=0 && xIndex<this.width && yIndex<this.height){
            return this.cells[xIndex][yIndex];
        }
    }

    // update related methods
    setSpeed(speed){
        this.speed = speed;
    }
    getSpeed(){
        return this.speed;
    }
    start(){
        this.prevtime = Date.now();
        window.requestAnimationFrame(this.update);
    }
    stop(){
        window.cancelAnimationFrame(this.updateRequest);
        delete this.updateRequest;
    }
    update(){
        const now = Date.now();
        if((now-this.prevtime)/1000 > 1/this.speed){
            this.prevtime = now;
            this.tick();
        }
        this.updateRequest = window.requestAnimationFrame(this.update);
    }
}