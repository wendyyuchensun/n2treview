// Parser module: identify category of current VM command,
//                arithmetic or memory access (push/pop)

var a = require('./a.js');
var ma = require('./ma.js');

modules.exports = (clearedCommand) => {
  if (clearedCommand.indexOf(/\s/) === -1) {
    return a(clearedCommand).join('\n');  // arithmetic
  } else {
    return ma(clearedCommand).join('\n');  // memory access 
  };
};
