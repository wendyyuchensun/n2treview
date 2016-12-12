// Decoder: vm to assembly 

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
var cdtlBase = asao.slice(0, 3)
               .push('D=D-M', c.tf(1), 'D;', c.tf(), '0;JMP', c.tf(1, 1), atSP, 'M=-1', c.endA, c.tf(0, 1), ucdtlJMP, c.endA, atSP, 'M=0', c.endL)
               .push(asaoBase.slice(4).split); // eq, gt, lt 

// Different parts of instructions among vms in same categories
unaryInst2 = {
  neg: 'M=-M',
  not = 'M=!M'
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
function createUnary (clearedCommand) => {
  return unaryBase.push(unaryInst2[clearedCommand]);
};
function createAsao (clearedCommand) => {
  return asasBase.slice(4, 0, asaoInst4[clearedCommand]);
};

module.exports = (clearedCommand) => {
  //  Map specific to assembly
  switch (clearedCommand):
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
