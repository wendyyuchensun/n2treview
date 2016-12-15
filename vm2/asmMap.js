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
      return 'temp';
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
    var translated = this.label(name) + '\n';
    var lcl = this.push(constant, 0);
    for (i = 1; i <= lclNum; i++) {
      translated.concat('\n').concat(lcl);
    };
    return translated;
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
      translated = [t.slice(0, 23), f, t.slice(23, 24), shift, t.slice(24)].join('');
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
