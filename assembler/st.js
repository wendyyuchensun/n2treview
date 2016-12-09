// Construct symbol table: search for notation of variables,
//                         make a map of found variables
//                         and correspondent value

var fs = require('fs');

module.exports = {
  st: (clearedDArr) => {
    var sTable = {
      // Predefined variables:
      'R0': '0',
      'R1': '1',
      'R2': '2',
      'R3': '3',
      'R4': '4',
      'R5': '5',
      'R6': '6',
      'R7': '7',
      'R8': '8',
      'R9': '9',
      'R10': '10',
      'R11': '11',
      'R12': '12',
      'R13': '13',
      'R14': '14',
      'R15': '15',
      'SP': '0',
      'LCL': '1',
      'ARG': '2',
      'THIS': '3',
      'THAT': '4',
      'SCREEN': '16384',
      'KBD': '24576'
    };
    function insertS (s, sIndex) {
      if (s) {
        sTable[s] = sIndex;
      };
    };
    var noLDArr = [];
    var s, sIndex, move = 0;
    clearedDArr.forEach((item, index) => {
      if (item.indexOf('(') === -1) {
        noLDArr.push(item); // A copy of instuctions, L ommited
      } else {
        s = item.slice(1, item.length - 1);
        sIndex = index - move;
      	move++;	      
      };
      insertS(s, sIndex);
    });
    var baseIndex = 16;
    noLDArr.forEach((item) => {
      var withoutAt = item.slice(1);
      var isNaN = parseInt(withoutAt);
    	if (item[0] === '@' && !isNaN && isNaN !== 0) {
        if (!sTable.hasOwnProperty(withoutAt)) {
          s = withoutAt;
          sIndex = baseIndex;
          baseIndex++;
        };
      };
      insertS(s, sIndex);
    });
    return sTable;
  }
};
