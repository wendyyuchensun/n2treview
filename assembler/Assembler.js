var fs = require('fs');
var clear = require('./clear.js');
var st = require('./st.js');

// Open the file
fs.readFile(__dirname + '/Max.asm', (err, data) => {
  if (err) throw err;
  var rawDArr = data.toString()
                    .split('\n');
  var clearedDArr = clear.clear(rawDArr);
  var sTable = st.st(clearedDArr);
});
