const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' });

const findMarker = (buffer, len) => {
  let markerFound = false
  let start = 0
  while(!markerFound) {
    markerFound = Array
      .from(buffer.slice(start, start + len))
      .reduce((acc, c) => {
        if (acc[c]) {
          acc['uniq'] = false
        } else {
          acc[c] = true
        }
        return acc
      }, { 'uniq': true })
      .uniq
    start++
  }
  return start + len - 1
}

console.log('Marker:', findMarker(input, 4))
console.log('Message:', findMarker(input, 14))