import $ from 'jquery';

function d(item, def){
    return item!==undefined?item:def;
}
function gradients(number, c1, c2){
    let m = c1.match(/#(\w{2})(\w{2})(\w{2})/);
    c1 = [parseInt("0x"+m[1]), parseInt("0x"+m[2]), parseInt("0x"+m[3])];
    m = c2.match(/#(\w{2})(\w{2})(\w{2})/);
    c2 = [parseInt("0x"+m[1]), parseInt("0x"+m[2]), parseInt("0x"+m[3])];

    const colors = [];
    for(var i=0; i<number; i++){
        const per = i/(number-1);
        const c = [
            Math.floor(Math.sqrt(c1[0]*c1[0]*(1-per) + c2[0]*c2[0]*per)) + 256, // +256 for leading 1
            Math.floor(Math.sqrt(c1[1]*c1[1]*(1-per) + c2[1]*c2[1]*per)) + 256,
            Math.floor(Math.sqrt(c1[2]*c1[2]*(1-per) + c2[2]*c2[2]*per)) + 256,
        ];
        colors.push("#"+c[0].toString(16).substr(1)+c[1].toString(16).substr(1)+c[2].toString(16).substr(1));
    }
    return colors;
}
function colorPer(c1, c2, per){
    let m = c1.match(/#(\w{2})(\w{2})(\w{2})/);
    c1 = [parseInt("0x"+m[1]), parseInt("0x"+m[2]), parseInt("0x"+m[3])];
    m = c2.match(/#(\w{2})(\w{2})(\w{2})/);
    c2 = [parseInt("0x"+m[1]), parseInt("0x"+m[2]), parseInt("0x"+m[3])];
    const c = [
        Math.floor(Math.sqrt(c1[0]*c1[0]*(1-per) + c2[0]*c2[0]*per)) + 256, // +256 for leading 1
        Math.floor(Math.sqrt(c1[1]*c1[1]*(1-per) + c2[1]*c2[1]*per)) + 256,
        Math.floor(Math.sqrt(c1[2]*c1[2]*(1-per) + c2[2]*c2[2]*per)) + 256,
    ];
    return "#"+c[0].toString(16).substr(1)+c[1].toString(16).substr(1)+c[2].toString(16).substr(1);
}
export default class GameRules{
    constructor(data){
        this.colors = d(data.colors, ["white", "red", "blue"]);
        this.startState = d(data.startState, 0);
        this.clickState = d(data.clickState, 1);
        this.edgeState = d(data.edgeState, 0);
        this.wrapping = d(data.wrapping, true);
        this.clickTransitions = d(data.clickTransitions, {0:1});
        this.cellClick = d(data.cellClick, ((cell)=>{
            const state = cell.getState();
            const nextState = this.clickTransitions[state];
            if(nextState!==undefined) cell.setState(nextState);
        }));
        this.cellTick = data.cellTick;
        this.tick = d(data.tick, ()=>{});

        this.style = $(
            "<style>"+
                (data.style||"")+
                this.colors.map((color, index)=>{
                    const borderColor = colorPer("#777777", color, 0.5);
                    return `div[state="${index}"] .board-cell-inner{
                        background-color: ${color};
                        border-color: ${borderColor};
                    }`;
                }).join("\n")+
            "</style>"
        );
    }
}