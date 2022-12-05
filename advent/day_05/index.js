const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' });

const [stacksTxt, movesTxt] = input.split('\n\n')

// [no, start, end]
const moves = movesTxt
  .split('\n')
  .map(m => m.split(' '))
  .map(([,no,, start,, end]) => [no, start, end].map(i => parseInt(i)))

// { stackNo: [bottom, middle, top] }
const stacks = stacksTxt
  .split('\n')
  .slice(0, -1)
  .reduce((acc, row) => {
    let c = 0;
    while(c * 4 < row.length) {
      let d = c + 1 // label
      acc[d] = acc[d] || []
      let cont = row.slice(c * 4, (c+1) * 4).trim()
      if (cont) {
        acc[d].unshift(cont.slice(1,2))
      }
      c = c + 1
    }
    return acc
  }, {})

// One by one
// moves.forEach(([no, start, end]) => {
//   for(let i = 0; i < no; i++) {
//     stacks[end].push(stacks[start].pop())
//   }
// })

// Multiple at once
moves.forEach(([no, start, end]) => {
  stacks[end].push(...stacks[start].splice(-no, no))
})

const tops = Object.keys(stacks).reduce((acc, no) => (acc.push(stacks[no].slice(-1)), acc), []).join('')

console.log('Top containers:', tops)