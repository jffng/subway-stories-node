/** Very simple chaining mecanism to serially execute asynchronous functions
 *
 */

function SerialRunner() {

    this.last
    this.first

    /** first arg if the function to call.
     * Other args are params.
     */
    this.add = function() {

        var func = arguments[0]

        var args = []
        for(var i=1; i < arguments.length ; i++) {
            //console.log("saving arg "+i+": "+arguments[i]);
            args.push(arguments[i])
        }


        if(!this.first) {
            //logger.info("First "+params);
            this.first = new ChainItem(func, args)
            this.last = this.first
        } else {
            //logger.info("Chaining "+params);
            var chainItem = new ChainItem(func, args)
            this.last.next = chainItem
            this.last = chainItem
        }

        return this
    }

    this.run = function(done) {

        if(stopped) {
            throw new Error("The process has been stopped and cannot be recovered.")
        }

        if(done) {
            this.add(done)
        }

        if(this.first) {
            //console.log("** running first");
            this.first.run()
        } else {
            throw new Error("You must call add() before calling run()")
        }
    }

    var errorHandler;

    this.onError = function(func) {
        errorHandler = func
    };

    function handleError(err) {
        if(errorHandler) {
            errorHandler(err)
        }
    }

    var stopped = false

    this.stop = function() {
//        console.log("Stopping run")
        stopped = true
    }

    function ChainItem(func, args) {
        this.args = args;
        this.func = func;
        var self = this;

        //console.log("has args");
        function handleNext(err) {
            //console.log("handleNext")

            if(err) {
                handleError(err)
            }

            //console.log("run func done. next()");
            if(self.next) {
                //logger.info("next of "+self.args);
                self.next.run();
            } else {
                console.log("ERR: SerialRunner --> no next");
                //logger.info("no next for "+self.args);
            }
        }

        this.run = function() {
            if(stopped) {
                return;
            }
//            console.log("running func");
            if(self.args) {
                this.args.push(handleNext);
                func.apply(this, self.args);
            } else {
                //console.log("no args");
                func(handleNext);
            }
        }
    }
}

module.exports = SerialRunner;
