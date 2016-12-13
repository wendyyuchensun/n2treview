// var argv = require('yargs').argv;
var fs = require('fs');
var readline = require('readline');
var clear = require('./modules/clearer.js');
var decode = require('./modules/decoder.js');

var order = {
  eq: 0,
  gt: 0,
  lt: 0
};

var rl = readline.createInterface({
  input: fs.createReadStream(__dirname + '/SimpleAdd.vm')
});

rl.on('line', (command) => {
  var clearedCommand = clear(command);
  var newOrder;
  if (order.hasOwnProperty(clearedCommand)) {
    newOrder = order[clearedCommand];
  };
  return decode(clearedCommand, newOrder);
});
