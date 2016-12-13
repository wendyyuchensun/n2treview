module.exports = {
  add: '@SP\nA=A-1\nM=D\nA=A-1\nM=D+M\n@SP\nA=A+1',
  sub: '@SP\nA=A-1\nM=D\nA=A-1\nM=D-M\n@SP\nA=A+1',
  and: '@SP\nA=A-1\nM=D\nA=A-1\nM=D&M\n@SP\nA=A+1',
  or: '@SP\nA=A-1\nM=D\nA=A-1\nM=D|M\n@SP\nA=A+1',
  neg: '@SP\nA=A-1\nM=-M',
  not: '@SP\nA=A-1\nM=!M',
  eq: '@SP\nA=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JEQ\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)\n@SP\nA=A+1',
  gt: '@SP\nA=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JGT\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)\n@SP\nA=A+1',
  lt: '@SP\nA=A-1\nM=D\nA=A-1\nD=D-M\n@EQ.true.\nD;JLT\n@EQ.false.\n0;JMP\n(EQ.true.)\nM=-1\n@EQ.end.\n0;JMP\n(EQ.false.)\nM=0\n@EQ.end.\n0;JMP\n(EQ.end.)\n@SP\nA=A+1',
 push: '@SP\nM=\nA=A+1' 
}
