var fs = require('fs');
var argv = require('yargs').argv;
var asmMap = require('./asmMap.js');

// Open file and turn it into an array
// with every line made into an item
fs.readFile(__dirname + '/' + argv.f + '.vm', (err, data) => {
  if (err) throw err;
  var dArr = data.toString().split(/\n/);
  // Clear unwanted parts
  var clearedDArr = [];
  dArr.forEach((item) => {
    item = item.replace(/^\/\/.*/g, '').replace(/\r/g, '').trim();
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
  function insertOrder (t, order) {
    return [t.slice(0, 35), order, t.slice(35, 52),
      order, t.slice(52, 68), order, t.slice(68, 83),
      order, t.slice(83, 100), order, t.slice(100, 114),
      order, t.slice(114, 129), order, t.slice(129)]
      .join('');
  };
  function insertNumber (t, num) {
    return [t.slice(0, 6), num, t.slice(6)].join('');
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
  var segments = {
    local: 'LCL',
    argument: 'ARG',
    this: 'THIS',
    that: 'THAT',
    temp: 'temp'
  };
  clearedDArr.forEach((item) => {
    var translated;
    if (item.indexOf('push') === -1 
        && item.indexOf('pop') === -1) {
      translated = asmMap[item];
      if (order.hasOwnProperty(item)) {
        translated = insertOrder(translated, order[item]);
        order[item]++;
      };
    } else {
      var l = msL(item);
      if (item.indexOf('push') >= -1) {
        if (l.seg === 'constant') {
          t = asmMap['push']['constant'];
          translated = [t.slice(0, 1), l.shift, t.slice(1)]
                       .join('');
        } else {
          t = asmMap['push']['other'];
          translated = [t.slice(0, 1), segments[l.seg], 
                       t.slice(1, 6), l.shift, t.slice(6)]
                         .join('');
        } 
      } else {
        t = asmMap.pop;
        translated = [t.slice(0, 18), l.seg, 
          t.slice(18, 24), l.shift, t.slice(24)].join('');
      }; 
    };
    translatedDArr.push(translated);
  });
  var newHack = translatedDArr.join('\n');
  fs.writeFile(__dirname + '/' + argv.f + '.asm', newHack, (err) => {
  if (err) throw err;
  console.log('File saved.')
  })
})
