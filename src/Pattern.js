export default class Pattern{
    constructor(rawPattern){
        let pattern = rawPattern.replace(/(?=\s)[^\n]|^\n\s*|\n?\s*\n?$/gm, "");

        const lines = pattern.split("\n");
        const width = lines[0].length;
        const height = lines.length;
        const xStartOffset = Math.floor(-(width - 1) / 2);
        const yStartOffset = Math.floor(-(height - 1) / 2);

        this.cells = [];
        for(let x=0; x<width; x++){
            for(let y=0; y<height; y++){
                var char = lines[y][x];
                if(!char.match(/\./)){
                    const xIndex = x + xStartOffset;
                    const yIndex = y + yStartOffset;
                    if(char.match(/\D/)) char = {a:-1, b:-2, c:-3, d:-4, e:-5, f:-6}[char];
                    this.cells.push({x:xIndex, y:yIndex, multiplier:Number(char)});
                }
            }
        }
    }
    getCells(){
        return this.cells;
    }
}