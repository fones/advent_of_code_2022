const fs = require('fs');
const { parse } = require('path');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' });

const fullOverlap =
  input
    .split('\n')
    .map(p => p.split(',').map(s => s.split('-').map(i => parseInt(i))))
    .filter(([[l1, l2], [r1, r2]]) => (l1 >= r1 && l2 <= r2) || (r1 >= l1 && r2 <= l2))
    .length

console.log('Full overlaps:', fullOverlap)

const overlaps =
  input
    .split('\n')
    .map(p => p.split(',').map(s => s.split('-').map(i => parseInt(i))))
    .filter(([[l1, l2], [r1, r2]]) => (
      (l2 >= r1 && l2 <= r2) ||
      (l1 >= r1 && l1 <= r2) ||
      (r1 >= l1 && r1 <= l2) ||
      (r2 >= l1 && r2 <= l2)
    ))
    .length

console.log('Overlaps:', overlaps)