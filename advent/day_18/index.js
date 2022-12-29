const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

let maxX = Number.MIN_VALUE
let minX = Number.MAX_VALUE

let maxY = Number.MIN_VALUE
let minY = Number.MAX_VALUE

let maxZ = Number.MIN_VALUE
let minZ = Number.MAX_VALUE

const data = input
  .split('\n')
  .map(line => line.split(',').map(i => parseInt(i)))
  .reduce((acc, [x, y, z]) => {
    acc[x] = acc[x] || {}
    acc[x][y] = acc[x][y] || {}
    acc[x][y][z] = 'd'
    maxX = Math.max(maxX, x)
    maxY = Math.max(maxY, y)
    maxZ = Math.max(maxZ, z)
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    minZ = Math.min(minZ, z)
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
  return points[x] && points[x][y] && points[x][y][z] == 'd'
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

const empty = (points, [x, y, z]) => {
  return !(points[x] && points[x][y] && (points[x][y][z] == 'd' || points[x][y][z] == 'w'))
}

// all points where water can flow from point p
const waterFlow = function (points, p) {
  const result = []
  for (const s of eachSide(p)) {
    if (empty(points, s)) {
      result.push(s)
    }
  }
  return result
}

const fillWithWater = function (points, [x, y, z]) {
  points[x]       = points[x]    || {}
  points[x][y]    = points[x][y] || {}
  if (points[x][y][z]) {
    throw "Already filled, wtf?"
  }
  points[x][y][z] = 'w'
}

const partTwo = (points) => {
  //fs.unlinkSync('./graph.txt')
  //fs.appendFileSync('./graph.txt', `Day 18;\n`)
  //fs.appendFileSync('./graph.txt', `::x::y::z;\n`)

  // Margin
  minX = minX - 1
  minY = minY - 1
  minZ = minZ - 1
  maxX = maxX + 1
  maxY = maxY + 1
  maxZ = maxZ + 1

  const box = (maxX - minX + 1) * (maxY - minY + 1) * (maxZ - minZ + 1)
  // console.log('BOX', box);

  // console.log('X-margin', minX, maxX);
  // console.log('Y-margin', minY, maxY);
  // console.log('Z-margin', minZ, maxZ);

  // Filter point within margin
  const marginFilter = ([x, y, z]) => {
    return minX <= x && x <= maxX 
        && minY <= y && y <= maxY
        && minZ <= z && z <= maxZ  
  }

  // Fill with water, start from margin
  const nextFill = [ [minX, minY, minZ] ]
  let fillCount = 0
  while(nextFill.length > 0) {
    const n = nextFill.shift()
    // Skip if is already filled
    if (!empty(points, n))
      continue
    // console.log('Filling', n);
    fillWithWater(points, n)
    fillCount = fillCount + 1
    const water = waterFlow(points, n).filter(marginFilter)
    // console.log('Water goes to', water);
    nextFill.push(...water)
  }

  // console.log('FILL COUNT', fillCount);

  // Count sides next to water
  let i = 0
  let dropParts = 0
  let water = 0
  // For each point
  for (const [x, y, z] of eachPoint(points)) {
    // That is a lava drop
    if (points[x][y][z] == 'd') {
      // fs.appendFileSync('./graph.txt', `drop::${x}::${y}::${z}::001::15::D::0.8::0.0::0.0::0::1.0;\n`)
      dropParts = dropParts + 1
      // check each side
      for (const [sx, sy, sz] of eachSide([x, y, z])) {
        // if the side is not empty
        if (!empty(points, [sx, sy, sz])) {
          // and the side is water
          if (points[sx][sy][sz] == 'w') {
            // if water count this
            i = i + 1
          }
        }
      }
    } else if (points[x][y][z] == 'w') {
      // fs.appendFileSync('./graph.txt', `water::${x}::${y}::${z}::001::15::W::0.0::0.0::0.0::0::1.0;\n`)
      water = water + 1
    }
  }

  // console.log('DROP PARTS', dropParts);
  // console.log('WATER', water);

  // console.log('CHECK (should be +)', box - dropParts - fillCount)

  return i
}

console.log('PART TWO:', partTwo(data));

// Visualization using: https://miabellaai.net/