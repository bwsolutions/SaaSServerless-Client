
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
};

export class Debug {

    constructor(prefix='',loglevel='') {

        this.setLoglevel(loglevel);
        this.base = prefix;
        this.prefix = prefix;

    }

    setLoglevel(loglevel) {
        if (loglevel === '')
            loglevel = 'debug';
        if (levels[loglevel] === undefined)
            this.loglevel = levels.debug;
        else
            this.loglevel = levels[loglevel];
    }
    addPrefix(str) {
        this.prefix += ":" + str;
    }
    resetPrefix(str) {
        this.prefix = this.base + ':' + str;
    }
    error (param) {
        if (typeof param === 'string') { console.error(this.prefix +': '+ param); }
        else { console.error(param); }
    }
    warn (param) {
        if (typeof param === 'string') { console.warn(this.prefix +': '+ param); }
        else { console.warn(param); }
    }
    info (param) {
        if (typeof param === 'string') { console.info(this.prefix +': '+ param); }
        else { console.info(param); }
    }
    verbose (param) {
        if (this.loglevel < levels.verbose) return;
        if (typeof param === 'string') { console.info(this.prefix +': '+ param); }
        else { console.info(param); }
    }
    debug (param) {
        if (this.loglevel < levels.debug) return;
        if (typeof param === 'string') { console.log(this.prefix +': '+ param); }
        else { console.log(param); }
    }
    silly (param) {
        if (this.loglevel < levels.silly) return;
        if (typeof param === 'string') { console.log(this.prefix +': '+ param); }
        else { console.log(param); }
    }
    log (param) {
        if (this.loglevel < levels.debug) return;
        if (typeof param === 'string') { console.log(this.prefix +': '+ param); }
        else { console.log(param); }
    }
}

