const Task = require('./task');

const DEFAULT_NEXT_EXECUTION = 10; // set the interval between executions

class Scheduler {
    constructor(params = {}) {
        this.defualtNextExecution = params.defualtNextExecution || DEFAULT_NEXT_EXECUTION;
        this.timeoutId;
        this.task;
    }

    restart() {
        console.log(`Staring next auto task in ${this.defualtNextExecution}s...`);
        this.timeoutId = setTimeout(() => this.set(...this.task.getArgs()), this.defualtNextExecution * 1000);
    }

    set(name, cb, params = {}) {
        // set auto to true if not specified
        const auto = params.hasOwnProperty('auto') ? params.auto : true;

        const task = new Task(name, cb, params);

        // check if automatic task
        if (auto) {
            this.task = task; // save auto task for further usage 
            this.task.start().then(() => {
                // restart task
                this.restart();
            }).catch((err) => {
                console.log(err);
                this.restart();
            });

        } else {
            /*
                if manual task then stop last running task 
                or the next execution task
            */

            this.task.stop();
            if (this.timeoutId && !this.timeoutId._called) {
                clearTimeout(this.timeoutId);
                console.log('Next execution aborted...');
            }

            return new Promise((resolve, reject) => {
                /*
                    run the manual task and restart 
                    the cycle once it's done or failed 
                */
                task.start().then(() => {
                    resolve();
                    this.restart();
                }).catch(err => {
                    console.log(err);
                    reject(err);
                    this.restart();
                });
            });

        }
    }
    
}

module.exports = Scheduler;