// Construct symbol table: search for notation of variables,
//                         make a map of found variables
//                         and correspondent value

module.exports = {
  st: (clearedDArr) => {
    var sTable = {};
    function insertS (s, sIndex) {
      if (!sTable.hasOwnProperty(s)) {
        sTable[s] = sIndex;
      }
    };
    var noLDArr = [];
    clearedDArr.forEach((item) => {
      if (item.indexOf('(') === -1) {
        noLDArr.push(item); // A copy of instuctions, L ommited
      };
    });
    var s, sIndex;
    clearedDArr.forEach((item, index) => {
      if (item.indexOf('(') !== -1) {
        s = item.splice(1, item.length - 1);
        var nextItem = clearedDArr[index + 1];
        sIndex = noLDArr.indexOf(nextItem); // What if there are more than 1 nextItem in noLDArr, meaning 2 or more assemly that look the same?
      }
    });
    return sTable; 
  }
}
