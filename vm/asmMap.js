module.exports = {
  atSP: '@SP',
  atXY: 'A=A-1',
  uJMP: '0;JMP',  // unconditional jump
  a: {
    unary: {
      base: [cu.atSP, cu.atXY],
      l2: {
        ng: 'M=-M',
        not: 'M=!M',
      }
    },
    binary: {
      base: [atSP, atXY, 'D=M', atXY, atSP, 'M=M-1'],
      middle: {
        la: {
          l4: {
            add: 'M=M+D',
            sub: 'M=M-D',
            and: 'M=M&D',
            or: 'M=M|D'
          }
        },
        comparism: {
          atTrue:,
          atFalse:,
          atEnd:,
          sub: ['D=D-M', atTrue, 'D;', atFalse, uJMP, '(@.true.)', 'M=-1', atEnd, uJMP, '(@.false.)', 'M=0', atEnd, uJMP, '(@.end.)'],
          l6Condition: {
            eq: 'JNE',
            gt: 'JGT',
            lt: 'JLT'
          }
        }
      }
    }
  }
}
