const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const movesList = Array.from(input)

const shapes = {
  //  ####
  '-': {
    height: 1,
    width: 4,
    rest: (chamber, [x, y]) => {
      return y == 0 
        || chamber[x][y - 1]     == '#'
        || chamber[x + 1][y - 1] == '#'
        || chamber[x + 2][y - 1] == '#'
        || chamber[x + 3][y - 1] == '#'
    },
    move: (chamber, [x, y], dir) => {
      if (dir == '>') {
        if (x + 4 >= chamber.length || chamber[x + 4][y] == '#') {
          return [x, y]
        } else {
          return [x + 1, y]
        }
      } else { // '<'
        if (x <= 0 || chamber[x - 1][y] == '#') {
          return [x, y]
        } else {
          return [x - 1, y]
        }
      }
    },
    fall: (chamber, [x, y]) => {
      if (x == -1) {
        return [2, height(chamber) - 1] // -1 for 0-index
      }
      return [x, y - 1]
    },
    draw: (chamber, [x, y]) => {
      chamber[x][y]     = '#'
      chamber[x + 1][y]   = '#'
      chamber[x + 2][y]     = '#'
      chamber[x + 3][y]       = '#'
    }
  },
  //  .#.
  //  ###
  //  .#.
  '+': {
    height: 3,
    width: 3,
    rest: (chamber, [x, y]) => {
      return y - 3 == 0
        || chamber[x + 1][y - 3] == '#' // center
        || chamber[x][y - 2] == '#' // left
        || chamber[x + 2][y - 2] == '#' // right
    },
    move: (chamber, [x, y], dir) => {
      if (dir == '>') {
        if (x + 3 >= chamber.length 
          || chamber[x + 2][y] == '#'  
          || chamber[x + 3][y - 1] == '#' 
          || chamber[x + 2][y - 2] == '#') {
          return [x, y]
        } else {
          return [x + 1, y]
        }
      } else { // '<'
        if (x <= 0 
          || chamber[x - 1][y - 1] == '#'
          || chamber[x][y] == '#'
          || chamber[x][y -2] == '#') {
          return [x, y]
        } else {
          return [x - 1, y]
        }
      }
    },
    fall: (chamber, [x, y]) => {
      if(x == -1) {
        return [2, height(chamber) - 1] // -1 for 0-index
      }
      return [x, y - 1]
    },
    draw: (chamber, [x, y]) => {
      chamber[x + 1][y]       = '#'
      chamber[x][y - 1]     = '#'
      chamber[x + 1][y - 1]   = '#'
      chamber[x + 2][y - 1]     = '#'
      chamber[x + 1][y - 2]   = '#'
    }
  },
  //  ..#
  //  ..#
  //  ###
  'L': {
    height: 3,
    width: 3,
    rest: (chamber, [x, y]) => {
      return y - 3 == 0
        || chamber[x][y - 3] == '#'
        || chamber[x + 1][y - 3] == '#'
        || chamber[x + 2][y - 3] == '#'
    },
    move: (chamber, [x, y], dir) => {
      if (dir == '>') {
        if (x + 3 >= chamber.length
          || chamber[x + 3][y] == '#'
          || chamber[x + 3][y - 1] == '#'
          || chamber[x + 3][y - 2] == '#') {
          return [x, y]
        } else {
          return [x + 1, y]
        }
      } else { // '<'
        if (x <= 0 
          || chamber[x + 1][y] == '#'
          || chamber[x + 1][y - 1] == '#'
          || chamber[x - 1][y - 2] == '#') {
          return [x, y]
        } else {
          return [x - 1, y]
        }
      }
    },
    fall: (chamber, [x, y]) => {
      if(x == -1) {
        return [2, height(chamber) - 1] // -1 for 0-index
      }
      return [x, y - 1]
    },
    draw: (chamber, [x, y]) => {
      chamber[x + 2][y]        = '#'
      chamber[x + 2][y - 1]    = '#'
      chamber[x + 2][y - 2]    = '#'
      chamber[x + 1][y - 2]  = '#'
      chamber[x][y - 2]    = '#'
    }
  },
  //  #
  //  #
  //  #
  //  #
  '|': {
    height: 4,
    width: 1,
    rest: (chamber, [x, y]) => {
      return y - 4 == 0
        || chamber[x][y - 4] == '#'
    },
    move: (chamber, [x, y], dir) => {
      if (dir == '>') {
        if (x + 1 >= chamber.length
          || chamber[x + 1][y] == '#'
          || chamber[x + 1][y - 1] == '#'
          || chamber[x + 1][y - 2] == '#'
          || chamber[x + 1][y - 3] == '#' ) {
          return [x, y]
        } else {
          return [x + 1, y]
        }
      } else { // '<'
        if (x <= 0 
          || chamber[x - 1][y] == '#'
          || chamber[x - 1][y - 1] == '#'
          || chamber[x - 1][y - 2] == '#'
          || chamber[x - 1][y - 3] == '#') {
          return [x, y]
        } else {
          return [x - 1, y]
        }
      }
    },
    fall: (chamber, [x, y]) => {
      if(x == -1) {
        return [2, height(chamber) - 1] // -1 for 0-index
      }
      return [x, y - 1]
    },
    draw: (chamber, [x, y]) => {
      chamber[x][y]     = '#'
      chamber[x][y - 1] = '#'
      chamber[x][y - 2] = '#'
      chamber[x][y - 3] = '#'
    }
  },
  //  ##
  //  ##
  'o': {
    height: 2,
    width: 2,
    rest: (chamber, [x, y]) => {
      return y - 2 == 0
        || chamber[x][y - 2] == '#'
        || chamber[x + 1][y - 2] == '#'
    },
    move: (chamber, [x, y], dir) => {
      if (dir == '>') {
        if (x + 2 >= chamber.length
          || chamber[x + 2][y] == '#'
          || chamber[x + 2][y - 1] == '#') {
          return [x, y]
        } else {
          return [x + 1, y]
        }
      } else { // '<'
        if (x <= 0 
          || chamber[x - 1][y] == '#'
          || chamber[x - 1][y - 1] == '#') {
          return [x, y]
        } else {
          return [x - 1, y]
        }
      }
    },
    fall: (chamber, [x, y]) => {
      if(x == -1) {
        return [2, height(chamber) - 1] // -1 for 0-index
      }
      return [x, y - 1]
    },
    draw: (chamber, [x, y]) => {
      chamber[x][y]       = '#'
      chamber[x + 1][y]     = '#'
      chamber[x][y - 1]   = '#'
      chamber[x + 1][y - 1] = '#'
    }
  }
}

const blocks = function* (max) {
  const order = ['-', '+', 'L', '|', 'o']
  for (let i = 0; i < max; i++) {
    yield order[i % order.length]
  }
}

const movesGenerator = function* () {
  let i = 0
  while(true) {
    yield movesList[i % movesList.length]
    i = i + 1
  }
}

// The tall, vertical chamber is exactly seven units wide.
// Each rock appears so that its left edge is two units away from the left wall 
// and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).

//                        |                            |
//                        |                            |
//                        |        C H A M B E R       |
//                        |                            |
//                        |                            |
const newChamber7 = () => [ [], [], [], [], [], [], [] ]

const addEmptyRow = (chamber, rows = 1) => {
  chamber.forEach(column => {
    for(let i = 0; i < rows; i++) {
      column.push('.')
    }
  });
}

// Remove empty rows on top of the chamber
const trim = (chamber) => {
  const tower = towerHeight(chamber)
  chamber.map(column => column.splice(tower))
}

const height = (chamber) => chamber[0].length

const towerHeight = (chamber) => {
  let i = height(chamber) - 1
  while (chamber.filter(column => column[i] == '#').length == 0) {
    i = i - 1
    if (i < 0)
      break
  }
  return i + 1
}

const draw = (chamber) => {
  const height = chamber[0].length
  const width = chamber.length
  for(let i = height - 1; i >= 0; i--) {
    const row = []
    for(let w = 0; w < width; w++) {
      row.push(chamber[w][i])
    }
    console.log('|', row.join(''), '|', i)
  }
}

const partOne = () => {
  // Create empty chamber
  const chamber = newChamber7()
  // Moves
  const moves = movesGenerator()
  // For each of 200 blocks
  for (const b of blocks(2022)) {
    // Add block to the chamber
    const block = shapes[b]
    // ..and its bottom edge is three units above the highest rock
    addEmptyRow(chamber, 3)
    // add space for block
    addEmptyRow(chamber, block.height)
    // block position
    let pos = [-1, -1]
    do {
      // Fall
      // First fall is to start position
      pos = block.fall(chamber, pos)
      // Move block right or left
      pos = block.move(chamber, pos, moves.next().value)
      // fall again if block not in rest
    } while (!block.rest(chamber, pos))
    // Draw block permanently
    block.draw(chamber, pos)
    // Trim empty rows
    trim(chamber)
  }
  // draw(chamber)
  return towerHeight(chamber)
}

console.log('TOWER HEIGHT', partOne());

