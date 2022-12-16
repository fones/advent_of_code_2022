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

const partTwo = (data) => {
  const min = 0
  const max = 4000000 // 20
  try {
    // for each sensor
    data.forEach(([[sx, sy], b, d], si) => {
      // find all points where d1 = d + 1
      const d1 = d + 1
      let points = []
      for (let i = -d1; i <= d1; i++) {
        px  = sx + i
        py1 = sy + (d1 - Math.abs(i))
        py2 = sy - (d1 - Math.abs(i))
        points.push([px, py1], [px, py2])
      }
      // exclude points outside the scope (min, max)
      points = points.filter( ([x, y]) => min <= x && x <= max && min <= y && y <= max )
      // for each other sensor
      data.forEach(( [os, ob, od], sj) => {
        // skip the same sensor
        if (si == sj) return
        // leave points that are outside the range
        points = points.filter(p => md(os, p) > od)
      })
      // after all sensor, check if any point left
      if (points.length > 0) {
        // this is the point
        throw points[0]
      } 
    })
    return null
  } catch (thisPoint) {
    console.log('Found beacon at:', thisPoint)
    const [x, y] = thisPoint
    return x * 4000000 + y
  }
}

console.log('PART TWO', partTwo(data))