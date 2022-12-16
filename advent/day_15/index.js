const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

// calculate Manhattan distance
const md = ([x1, y1], [x2, y2]) => Math.abs(x2 - x1) + Math.abs(y2 - y1)

const data = input
  .split('\n')
  .map(line => {
    const [s, b] = line
      .slice("Sensor at ".length)
      .split(': closest beacon is at ')
    const sensor = s
      .slice('x='.length)
      .split(', y=')
      .map(i => parseInt(i))
    const beacon = b
      .slice('x='.length)
      .split(', y=')
      .map(i => parseInt(i))
    return [sensor, beacon, md(sensor, beacon)]
  })

let maxX  = Math.max(...data.map(([[sx, sy], [bx, by], md]) => Math.max(sx, bx)))
let minX  = Math.min(...data.map(([[sx, sy], [bx, by], md]) => Math.min(sx, bx)))

const maxMD = Math.max(...data.map(([s, b, md]) => md))

maxX = maxX + maxMD
minX = minX - maxMD

// console.log('maxX', maxX)
// console.log('minX', minX)

const partOne = (data, y) => {
  // const points = new Array(maxX - minX).fill('.')
  const pointSet = new Set()
  // Analyze each point in row
  for(let x = minX; x <= maxX; x++) {
    const p = [x, y]
    // Check if this point is closer to sensor than beacon
    // if so... in that place cannot be other beacon
    data.forEach(([[sx, sy], [bx, by], mdSB], i) => {
      if (bx == x && by == y) {
        // points[x - minX] = 'B'
      } else if (sx == x && sy == y) {
        // points[x - minX] = 'S'
      } else if (md([sx, sy], p) <= mdSB) {
        // points[x - minX] = '#'
        pointSet.add(x)
      }
      //} else if (x >= 0 && x <= 20 && y >= 0 && y <= 20 && points[x - minX] == '.') {
      //   points[x - minX] = '@'
      //}
    });
  }
  // return points
  return pointSet.size
}

//for (let r = -2; r <= 22; r++) {
//  console.log(partOne(data, r).join('')); // row 10
//}

console.log('PART ONE', partOne(data, 2000000))