const Command = require('./command.js');

class Parser {
    constructor(input, program){
        this.input = input;
        this.program = program;
        this.pointer = 0;
    }

    parse() {
        const lines = this.input.split(/\n/gm).map(x => this.removeComments(x)).filter(x => x);
        this.pointer = 0;
    
        while(this.pointer < lines.length) {
            const line = lines[this.pointer];
            let name = this.getName(line);
            const parameters = this.getParameters(line);
            if (this.isLabel(name)) {
                this.addLabel(name);
                name = name.replace(':', '').trim();
            }
            this.addCommand(name, parameters);
            this.pointer++;
        }
    }

    getParameters(line) {
        const separatorIndex = line.indexOf(' ');
        if (separatorIndex == -1) return [];
        return line.substr(separatorIndex + 1).match(/[^\s',]+|'([^']*)'/g).map(x => x.replace(/'/g, ''));
    }

    getName(line){ return line.substring(0, line.indexOf(' ')) || line; }
    removeComments(line){ return line.replace(/;.*/, '').trim(); }
    isLabel(name){ return name.endsWith(':'); }
    addLabel(name){ this.program.labels[name.replace(':', '').trim()] = this.pointer; }
    addCommand(name, parameters){ return this.program.commands.push(new Command(name, parameters)); }
}

module.exports = Parser;
