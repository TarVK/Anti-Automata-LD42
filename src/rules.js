import GameRules from './GameRules';
import Pattern from './Pattern';

let shakeTimeout;
const spreadChance = 0.015;
// Set up the game
const spreadPatternOuter = new Pattern(`
    ..1..
    .a.a.
    1...1
    .a.a.
    ..1..
`);
const spreadPattern = new Pattern(`
    .1.
    1.1
    .1.
`);
export default new GameRules({
    cellTick: (cell, current)=>{
        const m = 2 -  1 / (1 + cell.tickNumber/5000);

        // Movement
        if([keys.w.isDown, keys.a.isDown, keys.s.isDown, keys.d.isDown].contains(true)==1){
            if(current==1){
                move: if(keys.w.isDown || keys.a.isDown || keys.s.isDown || keys.d.isDown){  
                    cells = cell.getNeighbors(spreadPattern);      
                    if(Math.random()<spreadChance*1.5 && cells.contains(state=>state>=5&&state<10))
                        return 5;
                    
                    if(keys.w.isDown && cell.getNeighbor(0, -1)!=0) break move;
                    if(keys.s.isDown && cell.getNeighbor(0, 1)!=0) break move;
                    if(keys.a.isDown && cell.getNeighbor(-1, 0)!=0) break move;
                    if(keys.d.isDown && cell.getNeighbor(1, 0)!=0) break move;

                    return keys.space.isDown?2:0;
                } 
            }else if(current==0){
                if(keys.w.isDown && cell.getNeighbor(0, 1)==1) return 1;
                if(keys.s.isDown && cell.getNeighbor(0, -1)==1)return 1;
                if(keys.a.isDown && cell.getNeighbor(1, 0)==1) return 1;
                if(keys.d.isDown && cell.getNeighbor(-1, 0)==1) return 1;
            }
        }

        // Shooting
        let cells;
        if(current==1){
            cells = cell.getNeighbors(spreadPattern);
            if(Math.random()<spreadChance && cells.contains(state=>state>=5&&state<10))
                return 5;
            return current;
        }else if(current==2){
            return 0;
        }else if(current==3){
            return 4;
        }else if(current==4){
            return 0;
        }else if(current==0){
            cells = cell.getNeighbors(spreadPattern);
            const outerCells = cell.getNeighbors(spreadPatternOuter);
            if(outerCells.contains(state=>state==-3||state==-4)) return 0;
            if(outerCells.contains(2) && cells.contains(1)){
                global.playSound(global.sounds.pew);
                return 3;
            }
            if(cells.contains(3) && outerCells.contains(state=>state==1||state==4))
                return 3;
        }

        // Virus
        if(current==0){
            if(Math.random()<spreadChance*m && cells.contains(state=>state>=5&&state<10)){
                global.playSound(global.sounds.blop);
                return 5;
            }
        }else if(current>=5 && current<9){
            const r = Math.random(); 
            if(r<0.02 && current<8) return current+1; // Just a color transition

            cells = cell.getNeighbors(spreadPattern);
            if(cells.contains(state=>state==3)){
                global.playSound(global.sounds.hit);
                return 10;
            }
            if((r<0.45 || (current==5 && r<0.65) || (current==6 && r<0.55)) && cells.contains(10)){
                global.playSound(global.sounds.hitSpread);
                return 10;
            }
        }

        // Anti-virus
        else if(current>=10){
            global.addScore(1);
            cell.board.tickPoints[0] += 1; // Track points in 1 tick
            return 0;
        }

        return current;
    },
    tick: (board)=>{
        // Track score for multipliers
        if(!board.tickPoints) board.tickPoints = [];
        board.tickPoints.unshift(0); // Add new point tracking for the next round
        if(board.tickPoints.length>60) board.tickPoints.pop();
        const totalPoints = board.tickPoints.reduce((a, b)=>a+b, 0);
        const multiplier = Math.min(8, Math.floor(1+totalPoints/25));
        global.setMultiplier(multiplier);

        const recentPoints = board.tickPoints.slice(0, 10).reduce((a, b)=>a+b, 0);
        if(recentPoints>10){
            clearTimeout(shakeTimeout); //shake effect
            if(recentPoints>30){
                board.element.removeClass("shake shakeSmall").addClass("shakeBig");
            }else if(recentPoints>20){
                board.element.removeClass("shakeBig shakeSmall").addClass("shake");
            }else{
                board.element.removeClass("shake shakeBig").addClass("shakeSmall");
            }
            shakeTimeout = setTimeout(()=>board.element.removeClass("shake shakeSmall shakeBig"), 100);
        }

        // Check if the player died
        if(board.element.find("[state='1']").length==0 && !board.stopped){
            board.stopped = true;
            stop();
        }
    },
    colors: [
        // Default
        "#eeeeee",
        // Character
        "#ff0000",
        // Bullets
        "#dd3e00",
        "#ffae00",
        "#ffc549",
        // Virus
        "#00ff00",
        "#00dd00",
        "#00bb00",
        "#009900",
        "#007700",
        // Anti-virus
        "#dddd00",
    ],
    style: `
        div[state="0"] .board-cell-inner{
            width: 10;
            height: 10;
            margin-top: 4px;
            border-bottom-width: 0px;
        }
        div[state="1"] .board-cell-inner{
            border-radius: 8px;
            transition: 0.1s;
        }
        div[state="2"] .board-cell-inner,
        div[state="3"] .board-cell-inner,
        div[state="4"] .board-cell-inner{
            border-radius: 12px;
            width: 20px;
            height: 20px;
            transition: 0.1s;
        }
        div[state="2"] .board-cell-inner{
            border-radius: 8px;
        }
        div[state="10"] .board-cell-inner{
            transition: 0.1s;
        }

        div[state="5"] .board-cell-inner{
            border-radius: 7px;
            width: 20px;
            height: 20px;
        }
        div[state="6"] .board-cell-inner{
            border-radius: 5px;
            width: 22px;
            height: 22px;
        }
        div[state="7"] .board-cell-inner{
            border-radius: 3px;
        }
    `,
    edgeState: 11,
    clickTransitions: {},
    wrapping: false,
})