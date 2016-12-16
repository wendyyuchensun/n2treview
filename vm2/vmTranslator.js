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
  var fName = item.replace(/\d+/g, '').trim();
  var lclNum = item.replace(fName, '').trim();
  var fInfo = {
    name: fName,
    lclNum: lclNum
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
  fs.readFile(__dirname + '/' + fileName + '.vm', (err, data) => {
      if (err) throw err;
    var dArr = data.toString().split(/\n/);
    // Clear unwanted parts
    var clearedDArr = [];
    dArr.forEach((item) => {
      item = item.replace(/^\/\/.*/g, '')
        .replace(/\r/g, '')
        .replace(/\/\/.*/g, '')
        .trim();
      if (item) {
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
         translated = asmMap.createF(f.name, f.lclNum);
       } else if (item.indexOf('call') === 0) {
	      translated = asmMap.call(f.name, parseInt(f.lclNum),
             returnOrder);
         returnOrder++; 
       } else {
         translated = asmMap.returnF();
       };
      }else {
        var l = msL(item);
        if (item.indexOf('push') > -1) {
          translated = asmMap
            .push(l.seg, l.shift, argv.f.toLowerCase());
        } else {
          translated = asmMap
            .pop(l.seg, l.shift, argv.f.toLowerCase());
        }; 
      };
      translatedDArr.push(translated);
    });
    var newHack = translatedDArr.join('\n');
    return newHack;
  });
};

//  Main function begins with detecting if the input
//  is a folder of multiple files or a single file
var translatedFiles = [];
var neededFiles = [];
var bootstrap = () => {
  var b = '@256\nD=A\n@SP\nM=D\n' + 
    asmMap.call('Sys.init', 0, returnOrder);
  returnOrder++;
  return b;
};
if (argv.f.indexOf('.vm') === -1) {
  fs.readdir (__dirname + '/' + argv.f, (err, files) => {
    files.forEach((item) => {
      if (item.indexOf('.vm') > -1) {
        item = item.replace('.vm', '').trim();
        neededFiles.push(item);
      };
    });
    neededFiles.forEach((item) => {
      var fName = argv.f + '/' + item;
      console.log(fName);
      translatedFiles.push(readSingleFile(fName));
    });
    translatedFiles.splice(0, 0, bootstrap()); 
  });
} else {
  var fName = argv.f.replace('.vm', '').trim();
  translatedFiles.push(readSingleFile(argv.f));
};
fs.writeFile(__dirname + '/' + argv.f + '.asm', 
    translatedFiles, (err) => {
  if (err) throw err;
  console.log('File saved.')
});
