// Source: https://github.com/kittykatattack/learningPixi
// Was too lazy to write this myself
export default function handleKey(keyCode){
    if(arguments.length>1){
        let keys = {
            keys: [],
            get isDown(){
                for(let i=0; i<this.keys.length; i++)
                    if(this.keys[i].isDown) return true;
                return false;
            },
            get isUp(){
                for(let i=0; i<this.keys.length; i++)
                    if(this.keys[i].isUp) return true;
                return false;
            },
            set press(press){
                for(let i=0; i<this.keys.length; i++)
                    this.keys[i].press = press;
            },
            set release(press){
                for(let i=0; i<this.keys.length; i++)
                    this.keys[i].release = release;
            }
        };
        for(let i=0; i<arguments.length; i++){
            const key = arguments[i];
            keys.keys.push(handleKey(key));
        }
        return keys;
    }else{
        let key = {};
        key.code = keyCode;
        key.isDown = false;
        key.isUp = true;
        key.press = undefined;
        key.release = undefined;
        //The `downHandler`
        key.downHandler = event => {
            if (event.keyCode === key.code) {
                if (key.isUp && key.press) key.press();
                key.isDown = true;
                key.isUp = false;
                event.preventDefault();
            }
        };
      
        //The `upHandler`
        key.upHandler = event => {
            if (event.keyCode === key.code) {
                if (key.isDown && key.release) key.release();
                key.isDown = false;
                key.isUp = true;
                event.preventDefault();
            }
        };
      
        //Attach event listeners
        window.addEventListener(
            "keydown", key.downHandler.bind(key), false
        );
        window.addEventListener(
            "keyup", key.upHandler.bind(key), false
        );
        return key;
    }
}