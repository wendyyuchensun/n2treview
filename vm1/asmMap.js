module.exports = {
  add: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D+M',
  sub: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D-M',
  and: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D&M',
  or: '@SP\nAM=A-1\nM=D\nA=A-1\nM=D|M',
  neg: '@SP\nAM=A-1\nM=-M',
  not: '@SP\nAM=A-1\nM=!M',
  eq: '@SP\nA=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JEQ\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)\n@SP\nA=A+1',
  gt: '@SP\nA=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JGT\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)\n@SP\nA=A+1',
  lt: '@SP\nA=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JLT\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)\n@SP\nA=A+1',
 push: {
   constant: '@\nD=A\n@SP\nM=D\nAM=A+1',
   other: '@\nA=A+\nD=M\n@SP\nD=M\nA=A+1'
 },
 pop: '@SP\nA=A-1\nM=D\n@\nA=A+\nM=D'
}
