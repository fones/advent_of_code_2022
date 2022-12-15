const keypress = async () => {
  process.stdin.setRawMode(true)
  return new Promise(resolve => process.stdin.once('data', data => {
    const byteArray = [...data]
    if (byteArray.length > 0 && byteArray[0] === 3) {
      console.log('^C')
      process.exit(1)
    }
    process.stdin.setRawMode(false)
    resolve()
  }))
}

const clearCanvas = (canvas) => {
  process.stdout.moveCursor(0, -canvas.length)
  process.stdout.clearScreenDown()
}

const printCanvas = (canvas, [minX, minY], [maxX, maxY], [px, py] = [-1, -1]) => {
  for (let y = 0; y <= maxY; y++) {
    // process.stdout.write(`[y:${y}]`);
    for(let x = minX; x <= maxX; x++) {
      if (px == x && py == y) {
        process.stdout.write('+')
      } else {
        process.stdout.write(canvas[x][y]);
      }
    }
    process.stdout.write("\n");
  }
}

module.exports = {
  keypress,
  clearCanvas,
  printCanvas,
}