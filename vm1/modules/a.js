var asmMap = require('./asmMap.js');

modules.exports = (clearedCommand) => {
  var unary = asmMap.a.unary;
  if (unary.l2.hasOwnProperty(clearedCommand) > -1) {
    return unary.base.push(unary.l2[clearedCommand]);
  } else {
    var bBase = asmMap.a.binary.base;
    var la = asmMap.binary.middle.la; 
    if (la.hasOwnProperty(clearedCommadn) > -1) {
      return bBase.slice(4, 0, la.l4[clearedCommand]);
    } else {
      var comparism = asmMap.a.binary.middle.comparism;
      var comparismSub = comparism.sub;
      var comparismBase = bBase.slice(4, 0, comparismSub);
      comparismBase[6] = comparism[6].concat(comparism.l6Condition[clearedCommand]);
     return comparismBase; 
    };
  }; 
},
  
