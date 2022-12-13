const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

// Throws:
// 0 - not in right order
// 1 - in the right order
const compare = (left, right) => {
  // console.log('Compare', left, '<>', right);
  if (typeof(left) == 'undefined' && right) {
    throw 1
  } else if (left && typeof(right) == 'undefined') {
    throw 0
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for(let i = 0; i < Math.max(left.length, right.length); i++) {
      const l = left[i]
      const r = right[i]
      compare(l, r)
    }
  } else if (Array.isArray(left)) {
    compare(left, [right])
  } else if (Array.isArray(right)) {
    compare([left], right)
  } else {
    if (left > right) {
      throw 0
    } else if (left < right) {
      throw 1
    } else { // the same
      // Nothing
    }
  }
}

const sum = input
  .split('\n\n')
  .map(pair => pair.split('\n').map(s => eval(s)))
  .map(([left, right], i) => {
    try {
      compare(left, right)
    } catch (correct) {
      return correct ? i + 1 : 0
    }
  })
  .reduce((sum, e) => sum + e, 0)

console.log('SUM:', sum);

const packets = input
  .split('\n')
  .filter(e => e.length > 0) // skip blank lines
  .map(pair => eval(pair))

packets.push([[2]])
packets.push([[6]])

packets.sort((a, b) => {
  try {
    compare(a, b)
  } catch(ex) {
    return ex > 0 ? -1 : 1
  }
})

const l1 = packets.findIndex(e => JSON.stringify(e) == '[[2]]') + 1
const l2 = packets.findIndex(e => JSON.stringify(e) == '[[6]]') + 1

console.log('LOCATION L1*L2', l1 * l2)