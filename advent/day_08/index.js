const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

let forest = input.split('\n').map(row => row.split('').map(i => parseInt(i)))

const ROWS = forest.length
const COLUMNS = forest[0].length

// https://medium.com/swlh/matrix-rotation-in-javascript-269cae14a124
const rotateMatrix90C = source => {
  // get the dimensions of the source matrix
  const M = source.length;
  const N = source[0].length;

  // create a new NxM destination array
  let destination = new Array(N);
  for (let i = 0; i < N; i++) {
    destination[i] = new Array(M);
  }

  // start copying from source into destination
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      destination[i][j] = source[M - j - 1][i];
    }
  }

  // return the destination matrix
  return destination;
};

let matrix = Array(ROWS).fill().map(()=>Array(COLUMNS).fill())

for(let rotate = 0; rotate < 4; rotate++) {
  // Visible from west
  forest.forEach((row, r) => {
    row.reduce((max, tree, c) => {
      if (tree > max) {
        matrix[r][c] = true
        return tree
      } else {
        return max
      }
    }, -1)
  })
  forest = rotateMatrix90C(forest)
  matrix = rotateMatrix90C(matrix)
}

const visible = matrix.reduce(
  (sum, row) => sum + row.reduce((rowSum, tree) => tree ? rowSum + 1 : rowSum, 0),
  0
)

console.log('VISIBLE:', visible)

let scores = Array(ROWS).fill().map(()=>Array(COLUMNS).fill())

for(let rotate = 0; rotate < 4; rotate++) {
  // Staring from west
  forest.forEach((row, r) => {
    row.forEach((tree, c) => {
      scores[r][c] = scores[r][c] || []
      const view = row.slice(0, c).reverse()
      if(view.length == 0) {
        scores[r][c].push(0)
      } else {
        let markers = view.map(e => e < tree ? 1 : 0)
        let viewLength = markers.indexOf(0) == -1 ? markers.length : (markers.indexOf(0) + 1)
        scores[r][c].push(viewLength)
      }
    })
  })
  forest = rotateMatrix90C(forest)
  scores = rotateMatrix90C(scores)
}

// Compute scores
const computeScores = scores.map(row => row.map(s => s.reduce((a, i) => a * i, 1)))

// Find max
const maxScore = Math.max(...computeScores.map(row => Math.max(...row)))

console.log('MAX SCORE:', maxScore)