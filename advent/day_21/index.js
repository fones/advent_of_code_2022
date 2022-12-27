const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const partOne = () => {
  const monkeys = input
    .split('\n')
    .map(line => {
      const [name, info] = line.split(': ')
      const number = parseInt(info)
      if (!isNaN(number)) {
        // return monkey that yells the number
        return {
          name,
          yell: () => number
        }
      } else {
        // return monkey that waits for other monkeys
        const [p1, op, p2] = info.split(' ')
        return {
          name,
          yell: () => eval(`monkeys["${p1}"].yell() ${op} monkeys["${p2}"].yell()`)
        }
      }
    })
    .reduce((obj, m) => Object.assign(obj, { [m.name]: m }), {})

  return monkeys['root'].yell()
}

console.log('PART ONE:', partOne());