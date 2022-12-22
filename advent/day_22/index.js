const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const [mapInput, pathInput] = input.split('\n\n')

const path = pathInput
  .split('R')
  .map(i => i.split('L').join('-L-'))
  .flat()
  .join('-R-')
  .split('-')

let mapRows = mapInput.split('\n')

const MAX_ROW = mapRows.length
const MAX_COLUMN = mapRows.reduce((max, row) => Math.max(max, row.length), 0)

// console.log(pathInput);
// console.log(path);

// console.log(MAX_ROW, MAX_COLUMN);

// Add empty spaces to all rows that are short
mapRows = mapRows.map(row => {
  if (row.length < MAX_COLUMN) {
    const need = MAX_COLUMN - row.length
    row = row.concat(new Array(need).fill(' ').join(''))
  }
  return row
})

// console.log(mapRows);

const map = mapRows.map(row => Array.from(row))

const START_X = 0
const START_Y = map[0].indexOf('.')

// console.log('START', START_X, START_Y);

const draw = ([x, y], d) => {
  map.forEach((row, rx) => {
    if (rx == x) {
      const copyRow = [...row]
      if (d == 0) copyRow[y] = '>'
      if (d == 1) copyRow[y] = 'v'
      if (d == 2) copyRow[y] = '>'
      if (d == 3) copyRow[y] = '^'
      console.log(copyRow.join(''));
    } else {
      console.log(row.join(''));
    }
  })
}

const next = ([x, y], d) => {
  let n = [-1, -1]
  switch(d) {
    case 0:
      n = [x, y + 1]
      break
    case 1:
      n = [x + 1, y]
      break
    case 2:
      n = [x, y - 1]
      break
    case 3:
      n = [x - 1, y]
      break
    default:
      throw "Bad direction"
  }
  if (n[0] < 0) {
    n[0] = MAX_ROW - 1 // get id of last row
  }
  if (n[0] >= MAX_ROW) {
    n[0] = 0
  }
  if (n[1] < 0) {
    n[1] = MAX_COLUMN - 1 // get id
  }
  if (n[1] >= MAX_COLUMN) {
    n[1] = 0
  }
  return n
}

const partOne = () => {
  // 0 - right, 1 - down, 2 - left, 3 - up
  let direction = 0
  // current position
  let position = [START_X, START_Y]
  // count step
  let s = 0 
  while(path.length) {
    const step = path.shift()
    // console.log('STEP', step);
    // Turn 90deg left
    if (step == 'L') {
      direction = direction - 1
      if (direction == -1) // from right
        direction = 3
    // Turn 90deg right
    } else if (step == 'R') {
      direction = direction + 1
        if (direction == 4) // from up
          direction = 0
    // Move
    } else {
      let stepCount = parseInt(step)
      let lastValidPosition = [...position]
      while(stepCount > 0) {
        const nextPosition = next(position, direction)
        const [x, y] = nextPosition
        const nextTile = map[x][y]
        // Open tile
        if (nextTile == '.') {
          position = nextPosition
          lastValidPosition = [...position]
          stepCount = stepCount - 1
        // Wall
        } else if (nextTile == '#') {
          position = lastValidPosition
          break // hit the wall
        } else {
          position = nextPosition
          // do not count this step
        }
      } // end while
    }
    s = s + 1
    // DEBUG
    // draw(position, direction)
    // if (s == 13) break
  }

  const rowNr = position[0] + 1
  const colNr = position[1] + 1
  return 1000 * rowNr + 4 * colNr + direction
}

console.log('PART ONE', partOne());
