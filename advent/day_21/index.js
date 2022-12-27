const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const monkeys = input
  .split('\n')
  .map(line => {
    const [name, info] = line.split(': ')
    const number = parseInt(info)
    if (!isNaN(number)) {
      // return monkey that yells the number
      return {
        name,
        yell: () => number,
        op: null,
        params: [],
        value: number,
        parents: []
      }
    } else {
      // return monkey that waits for other monkeys
      const [p1, op, p2] = info.split(' ')
      return {
        name,
        yell: () => eval(`monkeys["${p1}"].yell() ${op} monkeys["${p2}"].yell()`),
        op: op,
        params: [p1, p2],
        parents: [],
      }
    }
  })
  .reduce((obj, m) => Object.assign(obj, { [m.name]: m }), {})

// Create edges
Object.keys(monkeys).forEach(m => {
  monkeys[m].params.forEach(p => {
    monkeys[p].parents.push(m)
  })
})

const partOne = () => {
  return monkeys['root'].yell()
}

console.log('PART ONE:', partOne());

const partTwo = () => {
  // Set new vales
  monkeys["root"].op = '='

  // Find path from :humn to :root
  let tlm = "humn"
  const path = [tlm]
  while(monkeys[tlm].parents.length > 0) {
    if(monkeys[tlm].parents.length > 1) {
      throw "Multiple parents? WTF"
    }
    const parent = monkeys[tlm].parents[0]
    path.unshift(parent)
    if (parent == 'root') {
      break
    }
    tlm = parent
  }
  
  // console.log('TOP LEVEL MONKEY PATH', path);
  
  const other = (array, element) => {
    return array[0] == element
      ? array[1]
      : array[0]
  }

  let value = null
  for (let i = 0; i < path.length; i++) {
    // Current monkey
    const m = monkeys[path[i]]
    // console.log(path[i], m.op, m.params, value);

    // Next monkey in path
    const n = path[i+1]

    // Partner to next monkey
    const o = other(m.params, n)
    const ov = monkeys[o].yell()

    if (m.op == '=') {
      value = ov
    }
    else if (m.op == '/') {
      // value = m.params[0] / m.params[1]
      if (m.params[0] == n) {
        value = value * ov
      } 
      else if (m.params[1] == n) {
        value = ov / value
      }
    }
    else if (m.op == '+') {
      value = value - ov
    }
    else if (m.op == '*') {
      // value = m.params[0] * m.params[1]
      value = value / ov
    }
    else if (m.op == '-') {
      // value = m.params[0] - m.params[1]
      if (m.params[0] == n) {
        value = value + ov
      } 
      else if (m.params[1] == n) {
        value = ov - value
      }
    }

    // console.log('-', o, ov);
    // console.log('-', n, '?', value);
    
    if (n == 'humn') {
      return value
    }
  }
}

console.log('PART TWO:', partTwo());