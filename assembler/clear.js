// Clear: remove comments and empty spaces in raw data
//        and turn lines of raw data into an array 

module.exports = {
  clear: (rawDArr) => {
    var clearedDArr = [];
    rawDArr.forEach((item, index) => {
      item = item.replace(/\/\/.*/g, '')
                 .replace(/\s+/g, '')
                 .replace(/\r/g, '');
      if (item !== '') {
        clearedDArr.push(item);
      };
    });
    return clearedDArr;
  }
};
