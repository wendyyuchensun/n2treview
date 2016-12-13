module.exports = {
  add: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D+M',
  sub: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D-M',
  and: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D&M',
  or: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D|M',
  neg: '@SP\nAM=A-1\nM=-M',
  not: '@SP\nAM=A-1\nM=!M',
  eq: '@SP\nAM=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JEQ\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)',
  gt: '@SP\nAM1=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JGT\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.),
  lt: '@SP\nAM=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JLT\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)',
 push: {
   constant: '@\nD=A\n@SP\nA=M\nM=D\n@SP\nM=M+1',
   other: '@\nA=A+\nD=M\n@SP\nM=A\nD=M\n@SP\nM=M+1'
 },
 pop: '@SP\nAM=M-1\nM=D\n@\nA=A+\nM=D\n@SP\nA=M\nM=0'
}
