module.exports = {
  clear: (dArr) => {
    var newDArr = [];
    dArr.forEach((item) => {
     item.replace(/\/\/.*/g, '')
         .replace(/\r/g, '')
         .replace(/\s+/g, '');
     if (item !== '') {
      newDArr.push(item);
     }
    });
    return newDArr;
  };
};
