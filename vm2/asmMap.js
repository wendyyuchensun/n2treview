var segments = (seg, shift) => {
  switch(seg) {
    case 'local': 
      return 'LCL';
      break;
    case 'argument': 
      return 'ARG';
      break;
    case 'this': 
      return 'THIS';
      break;
    case 'that': 
      return 'THAT';
      break;
    case 'temp': 
      return 'R5';
      break;
    case 'pointer':
      return (shift === '0'? 'THIS':'THAT');
      break;
  };
};

module.exports = {
  add: '@SP\nAM=M-1\nD=M\nA=A-1\nM=D+M',
  sub: '@SP\nAM=M-1\nD=M\nA=A-1\nM=M-D',
  and: '@SP\nAM=M-1\nD=M\nA=A-1\nM=D&M',
  or: '@SP\nAM=M-1\nD=M\nA=A-1\nM=D|M',
  neg: '@SP\nA=M-1\nM=-M',
  not: '@SP\nA=M-1\nM=!M',
  eq: '@SP\nAM=M-1\nD=M\nA=A-1\nD=M-D\n@EQ.true.\nD;JEQ\n@SP\nA=M-1\nM=0\n@EQ.end.\n0;JMP\n(EQ.true.)\n@SP\nA=M-1\nM=-1\n(EQ.end.)',
  gt: '@SP\nAM=M-1\nD=M\nA=A-1\nD=M-D\n@GT.true.\nD;JGT\n@SP\nA=M-1\nM=0\n@GT.end.\n0;JMP\n(GT.true.)\n@SP\nA=M-1\nM=-1\n(GT.end.)',
  lt: '@SP\nAM=M-1\nD=M\nA=A-1\nD=M-D\n@LT.true.\nD;JLT\n@SP\nA=M-1\nM=0\n@LT.end.\n0;JMP\n(LT.true.)\n@SP\nA=M-1\nM=-1\n(LT.end.)',
  label: (label) => {
    return '(' + label + ')';
  },
  goto: (label) => {
    return '@' + label + '\n0;JMP';
  },
  ifGoTo: (label) => {
    return '@SP\nA=M\nM=D\n@SP\nAM=M-1\n@' + label + '\nD;JNE'; 
  },
  createF: (name, lclNum) => {
    var translated = '(' + name + ')';
    var lcl = '@SP\nA=M\nM=0\n@SP\nM=M+1';
    for (i = 1; i <= lclNum; i++) {
      translated = translated.concat('\n').concat(lcl);
    };
    return translated;
  },
  call: (func, num, returnOrder) => {
    return '@return' + returnOrder + '\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@LCL\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@ARG\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@THIS\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@THAT\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1\n@SP\nD=M\n@5\nD=D-A\n@' + num + '\nD=D-A\n@ARG\nM=D\n@SP\nD=M\n@LCL\nM=D\n@' + func + '\n0;JMP\n(return' + returnOrder + ')';
  },
  returnF: () => {
    return '@LCL\nD=M\n@5\nA=D-A\nD=M\n@R13\nM=D\n@SP\nA=M-1\nD=M\n@ARG\nA=M\nM=D\nD=A+1\n@SP\nM=D\n@LCL\nAM=M-1\nD=M\n@THAT\nM=D\n@LCL\nAM=M-1\nD=M\n@THIS\nM=D\n@LCL\nAM=M-1\nD=M\n@ARG\nM=D\n@LCL\nAM=M-1\nD=M\n@LCL\nM=D\n@R13\nA=M\n0;JMP'; 
  },
  push: (seg, shift, f) => {
    var t, s, translated
    switch (seg) {
      case 'constant': 
        t = '@\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1';
        translated = [t.slice(0, 1), shift, t.slice(1)]
          .join('');
        break;
      case 'temp':
        t = '@R5\nD=A\n@\nA=A+D\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1';
        translated = [t.slice(0, 9), shift, t.slice(9)].join('');
        break;
      case 'pointer':
        t = '@R3\nD=A\n@\nD=D+A\nA=D\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1';
        translated = [t.slice(0, 9), shift, t.slice(9)].join('');
        break;
      case 'static':
        t = '@.\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1';
        translated = [t.slice(0, 1), f, t.slice(1, 2), shift, t.slice(2)].join('');
        break;
      default: 
        t = '@\nD=M\n@\nD=D+A\nA=D\nD=M\n@SP\nA=M\nM=D\n@SP\nM=M+1';
        s = segments(seg, shift);
        translated = [t.slice(0, 1), s, t.slice(1, 7), shift, t.slice(7)].join('');
   };
   return translated;
 },
 pop: (seg, shift, f) => {
   var t, translated;
   switch (seg) {
    case 'static':
      t = '@SP\nAM=M-1\nD=M\n@.\nM=D';
      translated = [t.slice(0, 16), f, t.slice(16, 17), shift, t.slice(17)].join('');
      break;
    case 'temp':
      t = '@R5\nD=A\n@\nD=A+D\n@R13\nM=D\n@SP\nAM=M-1\nD=M\n@R13\nA=M\nM=D';
      translated = [t.slice(0, 9), shift, t.slice(9)].join('');
      break;
    case 'pointer':
      t = '@R3\nD=A\n@\nD=D+A\n@R13\nM=D\n@SP\nAM=M-1\nD=M\n@R13\nA=M\nM=D';
      translated = [t.slice(0, 9), shift, t.slice(9)].join('');
      break;
    default:
      t = '@\nD=M\n@\nD=D+A\n@R13\nM=D\n@SP\nAM=M-1\nD=M\n@R13\nA=M\nM=D';
      s = segments(seg, shift);
      translated = [t.slice(0, 1), s, t.slice(1, 7), shift, t.slice(7)].join('');
  };
   return translated;
 } 
}
