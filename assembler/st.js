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
    clearedDArr.forEach((item, index) => {
    	var s, sIndex, move = 0;
      if (item.indexOf('(') === -1) {
        noLDArr.push(item); // A copy of instuctions, L ommited
      } else {
      	s = item.slice(1, item.length - 1);
	sIndex = index - move;
      	move++;	      
      };
      if (s) {
	insertS(s, sIndex);
      };
    });
    var baseIndex = 1024;
    noLDArr.forEach((item) => {
	var withoutAt = item.slice(1);
	var isNaN = !(parseInt(withoutAt));
    	if (item[0] === '@' && isNaN) {
	   if (!sTable.hasOwnProperty(withoutAt)) {
	       s = withoutAt;
	       sIndex = baseIndex;
	       baseIndex++;
	   };
	};
	if (s) {
	  insertS(s, sIndex);
	};
    });
    return sTable;
  }
}
