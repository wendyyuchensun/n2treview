// Decode: turn assembles into machine languages
module.exports = {
  decode: (clearedDArr, sTable, cMap) => {
    // Clear LCommand first
    var noLDArr = [];
    clearedDArr.forEach((item) => {
      if (item[0] !== '(') {
        noLDArr.push(item);
      };
    });
    // Decode
    var decodedDArr = [];
    function decodeC (comp, dest, jump) {
      var decodedDest, decodedJump;
      var decodedC = '111';
      if (!dest) {
        decodedDest = '000';
      } else {
        decodedDest = cMap.dest(dest);
      }; 
      if (!jump) {
        decodedJump = '000';
      } else {
        decodedJump = cMap.jump[jump];
      };
      decodedC = decodedC.concat(cMap.comp[comp])
                         .concat(decodedDest)
                         .concat(decodedJump);
      return decodedC;
    };
    noLDArr.forEach((item) => {
      var decodedItem;
      if (item[0] === '@') {
        var withoutAt = item.slice(1);
        var isNaN = parseInt(withoutAt);
        if (!isNaN) {
          decodedItem = parseInt(sTable[withoutAt]).toString(2);
        } else {
          decodedItem = isNaN.toString(2);
        };
        var decodedItemLength = decodedItem.length;
        var z = '0';
        while (decodedItemLength < 16) {
          decodedItem = z.concat(decodedItem);
          decodedItemLength++;
        };
      } else {
        var comp, dest, jump;
        var hasEqualSign = item.indexOf('=');
        var hasSemiColon= item.indexOf(';');
        if (hasEqualSign > -1 && hasSemiColon > -1) {
          dest = item.slice(0, hasEqualSign);
          comp = item.slice(hasEqualSign + 1, hasSemiColon);
          jump = item.slice(hasSemiColon + 1);
        } else if (hasEqualSign > -1) {
          dest = item.slice(0, hasEqualSign);
          comp = item.slice(hasEqualSign + 1);
        } else if (hasSemiColon > -1) {
          comp = item.slice(0, hasSemiColon); 
          jump = item.slice(hasSemiColon + 1);
        } else {
          comp = item;
        };
        decodedItem = decodeC(comp, dest, jump);
      };
      decodedDArr.push(decodedItem);
    });
    return decodedDArr;
  }
};
