# Advent of code 2022

Try to solve the Advent of code 2022 puzzles in pain JavaScript

Try yourself: https://adventofcode.com/

## map & reduce

I will try to solve most of the puzzles with single chain of array methods: map, reduce, filter etc.

Example from Day 1

```js
const max = 
  input
    .split('\n\n')
    .map(elv => elv.split('\n').map(e => parseInt(e)))
    .map(elv => elv.reduce((cal, bag) => cal + bag, 0))
    .reduce((elv, max) => elv > max ? elv : max, 0)
```