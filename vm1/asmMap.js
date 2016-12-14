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
  add: '@SP\nAM=M-1\nM=D\nA=A-1\nM=D+M',
  sub: '@SP\nAM=M-1\nM=D\nA=A-1\nM=D-M',
  and: '@SP\nAM=M-1\nM=D\nA=A-1\nM=D&M',
  or: '@SP\nAM=M-1\nM=D\nA=A-1\nM=D|M',
  neg: '@SP\nAM=M-1\nM=-M',
  not: '@SP\nAM=M-1\nM=!M',
  eq: '@SP\nAM=M-1\nM=D\nA=A-1\nD=M-D\n@EQ.true.\nD;JEQ\n@SP\nA=M-1\nM=0\n@EQ.end.\n0;JMP\n(EQ.true.)\n@SP\nA=M-1\nM=-1\n(EQ.end.)\n',
  gt: '@SP\nAM=M-1\nM=D\nA=A-1\nD=M-D\n@GT.true.\nD;JEQ\n@SP\nA=M-1\nM=0\n@GT.end.\n0;JMP\n(GT.true.)\n@SP\nA=M-1\nM=-1\n(GT.end.)\n',
  lt: '@SP\nAM=M-1\nM=D\nA=A-1\nD=M-D\n@LT.true.\nD;JEQ\n@SP\nA=M-1\nM=0\n@LT.end.\n0;JMP\n(LT.true.)\n@SP\nA=M-1\nM=-1\n(LT.end.)\n',
  push: (seg, shift, f) => {
    var t, s, translated;
    switch (seg) {
      case 'constant': 
        t = '@\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1';
        translated = [t.slice(0, 1), shift, t.slice(1)]
          .join('');
        break;
      case 'static':
        t = '@.\nM=D\n@SP\nM=A\nM=D\n@SP\nM=M+1';
        translated = [t.slice(0, 1), f, t.slice(1, 2), shift, t.slice(2)].join('');
        break;
      default: 
       t = '@\nD=A\n@\nA=A+D\nD=M\n@SP\nM=A\nD=M\n@SP\nM=M+1';
       s = segments(seg, shift);
       translated = [t.slice(0, 1), shift, t.slice(1, 7), s, t.slice(7)].join('');
       break;
   };
   return translated;
 },
 pop: (seg, shift, f) => {
   var t, translated;
   switch (seg) {
    case 'static':
      t = '@SP\nAM=M-1\nM=0\nM=D\n@.\nM=D';
      translated = [t.slice(0, 23), f, t.slice(23, 24), shift, t.slice(24)];
      break;
    default:
      t = '@\nA=D\n@\nA=A+D\nD=A\n@R13\nM=D\n@SP\nAM=M-1\n@M=D\nM=0\n@R13\nM=A\nM=D';
      s = segments(seg, shift);
      translated = ['pop\n', t.slice(0, 1), shift, t.slice(1, 9), s, t.slice(9)];
      break;
  };
   return translated;
 } 
}
