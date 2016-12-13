// Decoder: cleared vm commands to assembly 

// Commonly-used assembly instructions
var c = {
  atSP: '@SP',
  atXY: 'A=A-1',
  ucdtlJMP: '0;JMP',  // unconditional jump
  tf: (tf, label) => { // conditional true, false, end ACommand or LCommand
    var output = '@.'.concat(tf.toString())
                     .concat('.'); 
    if (label) {
      output = '('.concat(output.subStr(1))
                  .concat(')');
    };
    return output; 
  },
  endA: this.tf('end'), // A Command with variable 'end'
  endL: this.tf('end', 1) // L Command of 'end'
};

// Comman parts of instructions
var unaryBase = [atSP, atXY]; // neg, not
var asaoBase = unary.push('D=M', atXY, atSP, 'A=A+1');  // add, sub, and, or
var cdtlBase = asaoBase.slice(4, 0, 'D=D-M');
console.log(cdtlBase);

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
cdtl = {

};

// Comman ways to create instructions
function createUnary (clearedCommand) {
  return unaryBase.push(unaryInst2[clearedCommand]);
};
function createAsao (clearedCommand) {
  return asasBase.slice(4, 0, asaoInst4[clearedCommand]);
};

module.exports = (clearedCommand) => {
  //  Map specific to assembly
  switch (clearedCommand)
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
};
