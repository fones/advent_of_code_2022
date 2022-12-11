const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

// Split addx to noop & addx
const commands = input
  .split('\n')
  .map(s => {
    const [cmd, value] = s.split(' ')
    return typeof(value) != "undefined" ? [cmd, parseInt(value)] : [cmd]
  })
  .reduce((acc, cmd) => {
    if (cmd[0] == 'addx') {
      acc.push(['noop'])
      acc.push(['addx', cmd[1]])
    } else {
      acc.push(cmd)
    }
    return acc
  }, [])


const res = commands.reduce((acc, [cmd, value], i) => {
  if ([20, 60, 100, 140, 180, 220].indexOf(i + 1) > -1) {
    acc.cycles.push(acc.x)
    const signal = (i + 1) * acc.x
    acc.signal.push(signal)
    acc.signalSum = acc.signalSum + signal
  }
  if (cmd == 'addx') {
    acc.x = acc.x + value
  }
  return acc
}, {
  x: 1,
  cycles: [],
  signal: [],
  signalSum: 0
})

console.log('STRENGTH SUM:', res.signalSum)

const crt = commands.reduce((acc, [cmd, value], cycle) => {
  const sprite = [acc.x - 1, acc.x, acc.x + 1]
  acc.display[cycle] = sprite.indexOf(cycle % 40) > -1 ? '#' : ' '
  if (cmd == 'addx') {
    acc.x = acc.x + value
  }
  acc.cycles = acc.cycles + 1
  return acc
}, {
  x: 1,
  cycles: 0,
  display: new Array(240).fill('-')
})

console.log('DISPLAY:')
for(let row = 0; row < 6; row++) {
  console.log(crt.display.slice(row * 40, (row + 1) * 40).join(''))
}