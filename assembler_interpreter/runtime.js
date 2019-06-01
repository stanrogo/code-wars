class Runtime {
    constructor(program) {
        this.program = program;
        this.position = 0;
        this.registers = {};
        this.functionStack = [];
        this.message = '';
        this.atEnd = false;
        this.comparison = [];
    }

    execute() {
        while (!this.isAtEnd()) {
            const command = this.getNextCommand();
            this[command.name].apply(this, command.args);
            this.position++;
        }

        return this.atEnd ? this.message : -1;
    }

    getNextCommand() {
        let command = this.program.commands[this.position];
        while (this.program.labels[command.name]) {
            command = this.program.commands[++this.position];
        }
        return command;
    };

    isAtEnd() { return this.atEnd || this.position >= this.program.commands.length; }
    getValue(y) { return Number.isNaN(parseInt(y, 10)) ? this.registers[y] : parseInt(y, 10); }
    doJump(lbl, comp) {
        this.position = this.comparison.includes(comp) ? this.program.labels[lbl] : this.position;
    }

    mov(x, y) {
        this.registers[x] = this.getValue(y);
    }
    inc(x) {
        this.registers[x]++;
    }
    dec(x) {
        this.registers[x]--;
    }
    add(x, y) {
        this.registers[x] += this.getValue(y);
    }
    sub(x, y) {
        this.registers[x] -= this.getValue(y);
    }
    mul(x, y) {
        this.registers[x] *= this.getValue(y);
    }
    div(x, y) {
        this.registers[x] = Math.floor(this.registers[x] / this.getValue(y));
    }
    jmp(lbl) {
        this.position = this.program.labels[lbl];
    }
    cmp(x, y) {
        this.comparison = [], x = this.getValue(x), y = this.getValue(y);
        this.comparison.push(x == y ? 'eq' : 'neq');
        this.comparison.push(x < y ? 'lt' : 'gte');
        this.comparison.push(x > y ? 'gt' : 'lte');
    }
    jne(lbl) {
        this.doJump(lbl, 'neq');
    }
    je(lbl) {
        this.doJump(lbl, 'eq');
    }
    jge(lbl) {
        this.doJump(lbl, 'gte');
    }
    jg(lbl) {
        this.doJump(lbl, 'gt');
    }
    jle(lbl) {
        this.doJump(lbl, 'lte');
    }
    jl(lbl) {
        this.doJump(lbl, 'lt');
    }
    call(lbl) {
        this.functionStack.push(this.position);
        this.jmp(lbl);
    }
    ret() {
        this.position = this.functionStack.pop();
    }
    msg(...args) {
        this.message = args.reduce((acc, arg) => acc.concat(typeof this.registers[arg] === 'undefined' ? arg : this.registers[arg]), '');
    }
    end() {
        this.atEnd = true;
    }
}

module.exports = Runtime;
