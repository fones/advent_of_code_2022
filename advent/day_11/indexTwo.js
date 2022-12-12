// For Part 2

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

const TOTAL_ROUNDS = 10000

// Here is the trick, Reddit help a lot.
// SOURCE: https://www.reddit.com/r/adventofcode/comments/zifqmh/comment/izv7hpx/?utm_source=share&utm_medium=web2x&context=3
//
// When you check if a number is divisible by 23, you check what the remainder is,
// right? For instance, 123 mod 23 = 8, so 123 is not divisible by 23.
// 
// But what if you thought 123 was WAY too big a number and you wanted to
// reduce it first? But you STILL want to do that "div by 23" test, with
// the same result. Well, you could first mod it by 23 (...wait for it...).
// That gives 8. Now instead of 123 you have 8. Then you do the divisibility
// test with this reduced number: 8 mod 23 = 8. That's the same, so it worked :)
// 
// Now watch what happens if you mod by a multiple, ANY multiple of 23 first
// to reduce your big number. For instance, you could mod by 
// 46 = 2 x 23: 123 mod 46 = 31. What does your div test give? 31 mod 23 = 8.
// The same! And this is always true, for any multiple. You can think of "mod 23" 
// as "take the 23-ness out of your number" while the remainder remains the same.
// 
// So that 2 could be the div test number of another monkey. And another one
// has 5, etc. etc. If you want to take the 23-ness, the 2-ness and the 5-ness out
// of a number, you mod by 2 x 5 x 23. As we saw above, the remainder will remain
// the same for our div tests with 2, 5, and 23. Because you can see this factor
// as a multiple of 23, or a multiple of 5, or a multiple of 2.//

const SUPER_MODULO = monkeys.reduce((r, m) => r * m.divisible, 1)

for (let round = 0; round < TOTAL_ROUNDS; round++) {
  for(let m = 0; m < monkeys.length; m++) {
    const curMonkey = monkeys[m]
    while(curMonkey.items.length) {
      const item = curMonkey.items.shift()
      const newItem = curMonkey.op(item) % SUPER_MODULO // Here is the trick!
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