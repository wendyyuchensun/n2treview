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
    return [t.slice(0, 36), order, t.slice(36, 53),
      order, t.slice(53, 69), order, t.slice(69, 84),
      order, t.slice(84, 101), order, t.slice(101, 115),
      order, t.slice(115, 130), order, t.slice(130)]
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
        translated = asmMap.push(l.seg, l.shift, argv.f.toLowerCase());
      } else {
        translated = asmMap.pusah(l.seg, l.shift, argv.f.toLowerCase());
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
