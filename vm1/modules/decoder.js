// Decoder: cleared vm commands to assembly 

// Commonly-used assembly instructions
var c = {
  atSP: '@SP',
  atXY: 'A=A-1',
  SPa1: 'A=A+1',
  DeqM: 'D=M',
  ucdtlJMP: '0;JMP'  // unconditional jump
};

// Comman parts of instructions
var unaryBase = [c.atSP, c.atXY]; // neg, not
var asaoBase = unaryBase.push(c.DeqM, c.atXY, c.atSP, c.SPa1);  // add, sub, and, or
var cdtlBase = unaryBase.push(c.DeqM, c.atXY, 'D=D-M', '0;', '0;JMP', c.atSP, 'M=1', '0;JMP', c.atSP, 'M=0', '0;JMP', c.atSP, c.SPa1);

// Different parts of instructions among vms in same categories
unaryInst2 = {
  neg: 'M=-M',
  not: 'M=!M'
};
asaoInst4 = {
  add: 'M=D+M',
  sub: 'M=D-M',
  and: 'M=D&M',
  or: 'M=D|M'
};
cdtl5 = {
  eq: 'JEQ',
  qt: 'JQT',
  lt: 'JLT'
};

// Comman ways to create instructions
function createUnary (clearedCommand) {
  return unaryBase.push(unaryInst2[clearedCommand]);
};
function createAsao (clearedCommand) {
  return asaoBase.splice(4, 0, asaoInst4[clearedCommand]);
};
var label = ['true', 'false', 'end'];
function createLable (clearedCommand, order) {
  var labelMap = {};
  label.forEach((item) => {
    labelMap[item] = ['@', clearedCommand.toUpperCase(), '.', item, order].join();
    labelMap[item + 'Label'] = '(' + labelMap[item].slice(0, 1) + ')'
  });
  return labelMap;
};
function createCdlt (clearedCommand, order) {
   var labelMap = createLabel(clearedCommand, order);
   var newCdtl = cdtlBase.splice(5, 0, labelMap.label[0])
                         .splice(7, 0, labelMap.label[2])
                         .splice(9, 0, labelMap.label[1])
                         .splice(11, 0, labelMap.label[4])
                         .splice(13, 0, labelMap.label[3])
                         .splice(15, 0, labelMap.label[4])
                         .splice(17, 0, labelMap.labe[5]);
   newCtdl[5] = newCtdl[5].concat(ctdl5[clearedLabel]);
   order++;
   return newCtdl;
};
module.exports = (clearedCommand, order) => {
  //  Map specific to assembly
  switch (clearedCommand) {
    case 'neg':
    case 'not':
      return createUnary(clearedCommand);
      break;
    case 'add':
    case 'sub':
    case 'and':
    case 'or':
      return createAsao(clearedCommand);
      break;
    case 'eq':
    case 'lt':
    case 'gt':
      return createCtdl(clearedCommand, order);
      break;
  };
};
