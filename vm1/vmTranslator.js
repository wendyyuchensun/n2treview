var fs = require('fs');
var asmMap = require('./asmMap.js');

// Open file and turn it into an array
// with every line made into an item
fs.readFile(__dirname + '/SimpleAdd.vm', (err, data) => {
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
  clearedDArr.forEach((item) => {
    var translated;
    if (item.indexOf('push') === -1 && item.indexOf('pop') === -1) {
      translated = asmMap[item];
      if (order.hasOwnProperty(item)) {
        translated = insertOrder(translated, order[item]);
        order[item]++;
      };
    } else if (item.indexOf('push') !== -1) {
      var q = item.replace('push', '')
                  .replace(/\s+/g, '')
                  .replace('constant', '');
      translated = insertNumber(asmMap['push'], q);
    };
    translatedDArr.push(translated);
  });
  console.log(translatedDArr);
})
