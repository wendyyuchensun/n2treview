var fs = require('fs');
var clear = require('./clear.js');
var st = require('./st.js');
var decode = require('./decode.js');
var cMap = require('./cMap.js')
var argv = require('yargs').argv;

// Open the file
fs.readFile(__dirname + '/' + argv.f + '.asm', (err, data) => {
  if (err) throw err;
  var rawDArr = data.toString()
                    .split('\n');
  var clearedDArr = clear.clear(rawDArr);
  var sTable = st.st(clearedDArr);
  var decodedDArr = decode.decode(clearedDArr, sTable, cMap);
  var newD = decodedDArr.join('\n');
  fs.writeFile('./' + argv.f  + '.hack', newD, (err) => {
    if (err) throw err;
    console.log('Success!');
  });
});
