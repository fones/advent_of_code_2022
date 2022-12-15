const fs = require('fs');
const { keypress, printCanvas, clearCanvas } = require('../helpers')

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

// x,y coordinates that form the shape of the path, where
// x represents distance to the right and
// y represents distance down.
const lines = input
  .split('\n')
  .map(line => line.split(' -> ')
    .map(xy => xy.split(',')
      .map(e => parseInt(e))))

const maxX = Math.max(...lines.map(line => Math.max(...line.map(cor => cor[0]))))
const minX = Math.min(...lines.map(line => Math.min(...line.map(cor => cor[0]))))

const maxY = Math.max(...lines.map(line => Math.max(...line.map(cor => cor[1]))))
const minY = Math.min(...lines.map(line => Math.min(...line.map(cor => cor[1]))))

console.log('X[min,max]', minX, maxX);
console.log('Y[min,max]', minY, maxY);

const canvas = new Array(maxX + 1).fill().map(row => 
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

const simulate = /*async*/ () => {
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

// console.log('Final canvas')
// clearCanvas(canvas)

console.log('PART ONE DROP COUNT', simulate())

