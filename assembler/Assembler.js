var fs = require('fs');
var clear = require('./clear.js');
var st = require('./st.js');
var decode = require('./decode.js');
var cMap = require('./cMap.js')

// Open the file
fs.readFile(__dirname + '/Max.asm', (err, data) => {
  if (err) throw err;
  var rawDArr = data.toString()
                    .split('\n');
  var clearedDArr = clear.clear(rawDArr);
  var sTable = st.st(clearedDArr);
  var decodedDArr = decode.decode(clearedDArr, sTable, cMap);
  var newD = decodedDArr.join('\n');
  fs.writeFile('./Max.hack', newD, (err) => {
    if (err) throw err;
    console.log('Success!');
  });
});
