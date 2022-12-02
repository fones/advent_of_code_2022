const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' });

const shapeScore = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3  // Scissors
}

// 0 if you lost, 3 if the round was a draw, and 6 if you won
const matrix = {
  A: { X: 3, Y: 6, Z: 0 },
  B: { X: 0, Y: 3, Z: 6 },
  C: { X: 6, Y: 0, Z: 3 },
}

const play = ([op, me]) => {
  return  matrix[op][me] + shapeScore[me]
}

const score =
  input
    .split('\n')
    .map(r => r.split(' '))
    .map(r => play(r))
    .reduce((game, sum) => game + sum, 0)

console.log('Score:', score)

// X means you need to lose, Y means you need to end the round in a draw, and Z means you need to win.
const matrix2 = {
  A: { X: 'Z', Y: 'X', Z: 'Y' },
  B: { X: 'X', Y: 'Y', Z: 'Z' },
  C: { X: 'Y', Y: 'Z', Z: 'X' },
}

const chooseShape = ([op, me]) => {
  return [op, matrix2[op][me]]
}

const score2 =
  input
    .split('\n')
    .map(r => r.split(' '))
    .map(r => chooseShape(r))
    .map(r => play(r))
    .reduce((game, sum) => game + sum, 0)

console.log('Score2:', score2)