const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const smallTest = {
  1: { 1: { 1: true }},
  2: { 1: { 1: true }}
}

const data = input
  .split('\n')
  .map(line => line.split(',').map(i => parseInt(i)))
  .reduce((acc, [x, y, z]) => {
    acc[x] = acc[x] || {}
    acc[x][y] = acc[x][y] || {}
    acc[x][y][z] = true
    return acc
  }, {})

const eachPoint = function* (points) {
  for (const x of Object.keys(points)) {
    for (const y of Object.keys(points[x])) {
      for (const z of Object.keys(points[x][y])) {
        yield [parseInt(x), parseInt(y), parseInt(z)]
      }
    }
  }
}

const eachAdjacent = function* ([x, y, z]) {
  for(let i = x - 1; i <= x + 1; i++) {
    for(let j = y - 1; j <= y + 1; j++) {
      for(let k = z - 1; k <= z + 1; k++) {
        if (i == x && j == y && k == z) {
          // Do not return point
        } else {
          yield [i, j, k]
        }
      }
    }
  }
}

const eachSide = function* ([x, y, z]) {
  const sides = [
    [x - 1, y, z],
    [x + 1, y, z],
    [x, y - 1, z],
    [x, y + 1, z],
    [x, y, z - 1],
    [x, y, z + 1]
  ]
  for (const s of sides) {
    yield s
  }
}

const exist = function (points, [x, y, z]) {
  return points[x] && points[x][y] && points[x][y][z]
}

const partOne = (points) => {
  let i = 0
  for (const p of eachPoint(points)) {
    for (const s of eachSide(p)) {
      if (!exist(points, s)) {
        i = i + 1
      }
    }
  }
  return i
}

console.log('PART ONE:', partOne(data));


