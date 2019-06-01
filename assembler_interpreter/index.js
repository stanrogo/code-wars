const fs = require('fs');

const Runtime = require('./runtime.js');
const Program = require('./program.js');
const Parser = require('./parser.js');

const inputFile = process.argv[2];

fs.readFile(inputFile, 'utf8', function(err, contents) {
    if (err) {
        throw new Error(err);
    }
    runProgram(contents);
});

const runProgram = (programText) => {
    const program = new Program();
    const parser = new Parser(programText, program);
    parser.parse();
    
    const runtime = new Runtime(program);
    const result = runtime.execute();
    console.log(result);
    console.log('Press any key to exit');

    const stdin = process.openStdin(); 
    stdin.setRawMode(true);
    stdin.on('data', process.exit.bind(process, 0));
};
