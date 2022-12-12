// For Part 1

const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const monkeys = input
  .split('\n\n')
  .map((desc, i) => {
    const lines = desc.split('\n')
    const items = lines[1].split(': ')[1].split(', ').map(i => parseInt(i))
    const opDesc = lines[2].split('new = old ')[1]
    const opA = opDesc.split(' ')
    const divisible = parseInt(lines[3].split('by ')[1])
    const test = (v) => v % divisible == 0
    const testTrueThrow = parseInt(lines[4].split('monkey ')[1])
    const testFalseThrow = parseInt(lines[5].split('monkey ')[1])
    return {
      id: i,
      items,
      opDesc,
      opA,
      op: (v) => {
        const [o, a] = opDesc.split(' ')
        const arg = a == 'old' ? v : parseInt(a)
        if (o == '+')
          return v + arg
        if (o == '*')
          return v * arg
      },
      divisible,
      test,
      testTrueThrow,
      testFalseThrow,
      throwTo: (v) => (test(v) ? testTrueThrow : testFalseThrow),
      inspect: 0
    }
  })

const TOTAL_ROUNDS = 20

for (let round = 0; round < TOTAL_ROUNDS; round++) {
  for(let m = 0; m < monkeys.length; m++) {
    const curMonkey = monkeys[m]
    while(curMonkey.items.length) {
      const item = curMonkey.items.shift()
      const newItem = Math.floor(curMonkey.op(item) / 3)
      const toMonkey = curMonkey.throwTo(newItem)
      monkeys[toMonkey].items.push(newItem)
      curMonkey.inspect = curMonkey.inspect + 1
    }
  }
}

const mostActiveMonkeyBusiness = 
  monkeys
  .sort((a, b) => b.inspect - a.inspect)
  .slice(0, 2)
  .reduce((sum, m) => sum * m.inspect, 1)

console.log('MOST ACTIVE MONKEY BUSINESS:', mostActiveMonkeyBusiness);