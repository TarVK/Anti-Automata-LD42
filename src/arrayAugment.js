function map(item, func){
    return func? func(item): item;
}
Array.prototype.sum = function(func){
    return this.reduce((prev, item)=>prev+map(item,func), 0);
};
Array.prototype.min = function(func){
    let min = Infinity;
    this.forEach(item=>{
        if(item<min) 
            min = map(item,func);
    });
    return min;
};
Array.prototype.max = function(func){
    let max = -Infinity;
    this.forEach(item=>{
        if(item>max) 
            max = map(item,func);
    });
    return max;
};
Array.prototype.contains = function(searchItem, func){
    let count = 0;
    if(typeof(searchItem)=="function"){
        this.forEach(item=>{
            count += searchItem(map(item, func));
        });
    }else{
        this.forEach(item=>{
            if(map(item, func)==searchItem)
                count++;
        });
    }
    return count;
}