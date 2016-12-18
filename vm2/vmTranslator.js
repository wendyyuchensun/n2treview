var fs = require('fs');
var argv = require('yargs').argv;
var asmMap = require('./asmMap.js');
// predefined func and variables
function insertOrder (t, order) {
  return [t.slice(0, 36), order, t.slice(36, 65),
    order, t.slice(65, 81), order, t.slice(81, 106),
    order, t.slice(106)]
    .join('');
};
function clearLabel (item) {
  return item.replace('label', '')
    .replace('goto', '')
    .replace('if-', '')
    .replace(/\s+/g, '')
    .trim();
};
function fInfo (item) {
  item = item.replace('function', '')
    .replace('call', '')
    .trim();
  var fName = item.replace(/\s+\d+/g, '').trim();
  var num = item.replace(fName, '').trim();
  var fInfo = {
    name: fName,
    num: parseInt(num)
  };
  return fInfo;
};
function msL (item) {
  item = item.replace('push', '')
             .replace('pop', '')
             .trim();
  var seg = item;
  seg = seg.replace(/\d+/g, '').trim();
  var s = item.replace(seg, '').trim();
  var shift = (s === ''? '0':s);
  var location = {
    seg: seg,
    shift: shift
  };
  return location;
};
var returnOrder = 0;
// Open file and turn it into an array
// with every line made into a seperate item
function readSingleFile (fileName) {
  var d = fs.readFileSync(__dirname + '/' + fileName + '.vm');
  var dArr = d.toString().split(/\n/);
  // Clear unwanted parts
  var clearedDArr = [];
  dArr.forEach((item) => {
    item = item.replace(/^\/\/.*/g, '')
      .replace(/\r/g, '')
      .replace(/\/\/.*/g, '')
      .trim();
    if (item !== '') {
      clearedDArr.push(item);
    };
  });
  // Translate
  var translatedDArr = [];
  var order = {
    eq: 0,
    gt: 0,
    lt: 0
  };
  var newHck;
  clearedDArr.forEach((item) => {
    var translated;
    if (item.indexOf('push') !== 0 
        && item.indexOf('pop') !== 0 
        && item.indexOf('label') !== 0
        && item.indexOf('goto') !== 0
        && item.indexOf('if') !== 0
        && item.indexOf('call') !== 0
        && item.indexOf('function') !== 0
        && item.indexOf('return') !== 0) {
      translated = asmMap[item];
      if (order.hasOwnProperty(item)) {
        translated = insertOrder(translated, order[item]);
        order[item]++;
      };
    } else if (item.indexOf('label') === 0 
        || item.indexOf('goto') === 0
        || item.indexOf('if') === 0) {
        var label = clearLabel(item);
      if (item.indexOf('label') === 0) {
        translated = asmMap.label(label);
      } else {
        if (item.indexOf('if') === 0) {
          translated = asmMap.ifGoTo(label);
        } else {
          translated = asmMap.goto(label);  
        } 
      };
    } else if (item.indexOf('call') === 0
        || item.indexOf('function') === 0
        || item.indexOf('return') === 0) {
     var f = fInfo(item);
     if (item.indexOf('function') === 0)  {
       translated = asmMap.createF(f.name, f.num);
     } else if (item.indexOf('call') === 0) {
       translated = asmMap.call(f.name, f.num, returnOrder);
       returnOrder++; 
     } else {
       translated = asmMap.returnF();
     };
    } else {
      var l = msL(item);
      var file = fileName.replace(/^.*\//, '').trim();
      if (item.indexOf('push') > -1) {
        translated = asmMap
          .push(l.seg, l.shift, file.toLowerCase());
      } else {
        translated = asmMap
          .pop(l.seg, l.shift, file.toLowerCase());
      }; 
    };
    translatedDArr.push('// ' + fileName + ': ' + item + '\n' 
        + translated);
    newHack = translatedDArr.join('\n');
  });
  return newHack;
};

//  Main function begins with detecting if the input
//  is a folder of multiple files or a single file
var translatedFiles = [];
var neededFiles = [];
var bootstrap = () => {
  var b = '// boostrap\n@256\nD=A\n@SP\nM=D\n' + 
    asmMap.call('Sys.init', 0, returnOrder);
  returnOrder++;
  return b;
};
if (argv.f.indexOf('.vm') === -1) {
  translatedFiles.push(bootstrap());
  files = fs.readdirSync ('./' + argv.f);
  files.forEach((item) => {
    if (item.indexOf('.vm') > -1) {
      item = item.replace('.vm', '').trim();
      neededFiles.push(item);
    };
  });
  neededFiles.forEach((item) => {
    var fName = argv.f + '/' + item;
    var newHack = readSingleFile(fName);
    translatedFiles.push(newHack);
  });
} else {
  var fName = argv.f.replace('.vm', '').trim();
  var newHack = readSingleFile(fName);
  translatedFiles.push(newHack);
};
translatedFiles = translatedFiles.join('\n');
fs.writeFile(__dirname + '/' + argv.f + '.asm', 
    translatedFiles, (err) => {
  if (err) throw err;
  console.log('File saved.')
});
