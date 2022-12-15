const fs = require('fs');
const { keypress, printCanvas, clearCanvas } = require('./helpers')

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

// x,y coordinates that form the shape of the path, where
// x represents distance to the right and
// y represents distance down.
const lines = input
  .split('\n')
  .map(line => line.split(' -> ')
    .map(xy => xy.split(',')
      .map(e => parseInt(e))))

let maxX = Math.max(...lines.map(line => Math.max(...line.map(cor => cor[0]))))
let minX = Math.min(...lines.map(line => Math.min(...line.map(cor => cor[0]))))

let maxY = Math.max(...lines.map(line => Math.max(...line.map(cor => cor[1]))))
let minY = Math.min(...lines.map(line => Math.min(...line.map(cor => cor[1]))))

let canvas = new Array(maxX + 1).fill().map(row => 
    new Array(maxY + 1).fill().map(c => '.')
  )

const drawLine = ([sX, sY], [eX, eY]) => {
  // console.log('Draw line from', sX, sY, 'to', eX, eY )
  // Horizontal
  if (sX == eX) {
    for (let i = Math.min(sY, eY); i <= Math.max(sY, eY); i++) {
      canvas[sX][i] = '#'
    }
  }
  // Vertical
  else if (sY == eY) { 
    for (let i = Math.min(sX, eX); i <= Math.max(sX, eX); i++) {
      canvas[i][sY] = '#'
    }
  }
  else {
    throw "Diagonal line?"
  }
}

lines.forEach(line => {
  for (let i = 1; i < line.length; i++) {
    drawLine(line[i-1], line[i])
  }
})

const newDrop = () => {
  let x = 500
  let y = 0
  let rest = false
  let fall = false
  const move = () => {
    // Fall
    if (x >= maxX || x < minX || y >= maxY) {
      fall = true
    }
    // Move simply down
    else if (canvas[x][y + 1] == '.') {
      y = y + 1
    } 
    // Something is blocking
    else if (canvas[x][y + 1] != '.') {
      // Left diagonal is free
      if (canvas[x - 1][y + 1] == '.') {
        // Check if we can move there, on left side is nothing
        // ...they don't bother about that
        if (true || canvas[x - 1][y] == '.') {
          x = x - 1
          y = y + 1
        } else {
          rest = true
        }
      } 
      // Right diagonal is free
      else if (canvas[x + 1][y + 1] == '.') {
        // Check if we can move there, on right side is nothing
        // ...they don't bother about that
        if (true || canvas[x + 1][y] == '.') {
          x = x + 1
          y = y + 1
        } else {
          rest = true
        }
      }
      // all blocked
      else {
        rest = true
      }
    }
  }
  const print = () => {
    canvas[x][y] = 'o'
  }
  return { 
    xy: () => [x, y], 
    move, 
    print,
    isRest: () => rest, 
    didFall: () => fall
  }
}

const simulatePartOne = /*async*/ () => {
  let dropCount = 0
  
  while (++dropCount) {
    
    const drop = newDrop()
    
    while (!drop.isRest() && !drop.didFall()) {
      // clearCanvas(canvas)
      // printCanvas(canvas, [minX, minY], [maxX, maxY], drop.xy())
      // await keypress()
      drop.move()
    }

    drop.print()
  
    if (drop.didFall()) {
      break;
    }
  }

  // printCanvas(canvas, [minX, minY], [maxX, maxY])
  
  return dropCount - 1 // not count the one that fall
}

console.log('PART ONE DROP COUNT', simulatePartOne())

// console.log('Final canvas of part one')
// printCanvas(canvas, [minX, minY], [maxX, maxY])

maxY = maxY + 2

minX = 0
maxX = maxX * 2 // let use 2x

canvas = new Array(maxX + 1).fill().map(row => 
  new Array(maxY + 1).fill().map(c => '.')
)

lines.forEach(line => {
  for (let i = 1; i < line.length; i++) {
    drawLine(line[i-1], line[i])
  }
})

// Draw bottom line
drawLine([0, maxY], [maxX, maxY])

// printCanvas(canvas, [minX, minY], [maxX, maxY])

const simulatePartTwo = /*async*/ () => {
  let dropCount = 0
  
  while (++dropCount) {
    
    const drop = newDrop()
    
    while (!drop.isRest()) {
      // clearCanvas(canvas)
      // printCanvas(canvas, [minX, minY], [maxX, maxY], drop.xy())
      // await keypress()
      drop.move()
    }

    drop.print()

    // Rest on the start point
    if (drop.isRest() && drop.xy()[1] == 0) {
      break
    }
  }

  // printCanvas(canvas, [minX, minY], [maxX, maxY])
  
  return dropCount
}

console.log('PART TWO DROP COUNT', simulatePartTwo())

// console.log('Final canvas of part two')
// printCanvas(canvas, [minX, minY], [maxX, maxY])