// private _fail has 10% to return true
function _fail() {
    return ((Math.floor(Math.random() * 10)) === 0) ? true : false;
}

const DEFAULT_EXECUTION_TIME = 15;

class Task {

    constructor(name, cb, params = {}) {
        this.cb = cb;
        this.name = name;
        this.params = params;
        this.timeoutId;
    }

    start() {
        return new Promise((resolve, reject) => {
            console.log(`Running ${this.name}...`);

            if (_fail()) {
                return reject('Task failed.');
            }
            
            this.timeoutId = setTimeout(() => {
                this.cb();
                resolve();
            }, DEFAULT_EXECUTION_TIME * 1000);
        });
    }

    stop() {
       
        if(!this.timeoutId || this.timeoutId._called) 
            return false;
        
        console.log('Task aborted...');
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
    }

    getArgs() {
        return [
            this.name,
            this.cb,
            this.params
        ];
    }
}

module.exports = Task;