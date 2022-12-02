const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' });

const max = 
  input
    .split('\n\n')
    .map(elv => elv.split('\n').map(e => parseInt(e)))
    .map(elv => elv.reduce((cal, bag) => cal + bag, 0))
    .reduce((elv, max) => elv > max ? elv : max, 0)

console.log('Max:', max)

const max3 = 
  input
    .split('\n\n')
    .map(elv => elv.split('\n').map(e => parseInt(e)))
    .map(elv => elv.reduce((cal, bag) => cal + bag, 0))
    .sort((a,b) => b - a)
    .slice(0, 3)
    .reduce((elv, sum) => elv + sum, 0)

console.log('Max3:', max3)