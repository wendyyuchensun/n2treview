var argv = require('yargs').argv;
var fs = require('fs');
var readline = require('readline');
var clear = require('./modules/clear.js');
var decode = require('./modules/parser.js');

function errorMessage (err) {
  console.log(err);
};

var rl = readline.createInterface({
  input: fs.createReadStream(__dirname + '/SimpleAdd.vm')
});

rl.on('line', (command) => {
  clear(command).then((clearedCommand) => {
    decode(clearedcommand);
  }, errorMessage(err)).then((decodedCommand) => {
    
  }, errorMessage(err))
});
