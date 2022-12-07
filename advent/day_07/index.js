const fs = require('fs');

const log = fs.readFileSync('./input.txt', { encoding: 'utf8' }).split('\n')

const fileSystem = {}

class Linux {
  currentDirectory = '/'
  files = {}
  dirs = {}

  cd(param) {
    if (param === '/') {
      this.currentDirectory = '/'
    } else if (param === '..') {
      this.currentDirectory = this.currentDirectory.split('/').slice(0, -2).join('/') + '/'
    } else {
      this.currentDirectory = `${this.currentDirectory}${param}/`
      this.dirs[this.currentDirectory] = 0
    }
  }

  ls(param) {
    // Nothing
  }

  run(command) {
    const [$, cmd, param] = command.split(' ')
    // Run
    this[cmd](param)
  }

  dir(file) {
    const [type, name] = file.split(' ')
    if (type == 'dir') {
      // Nothing
    } else {
      const size = parseInt(type)
      this.files[`${this.currentDirectory}${name}`] = size
      this.dirs[this.currentDirectory] = 0
    }
  }

  logAnalyzer(log) {
    // Command
    if (log[0] === '$') {
      this.run(log)
    } else {
      this.dir(log)
    }
  }

  computeDirSize() {
    Object.keys(machine.dirs).forEach(dir => {
      Object.keys(machine.files).forEach(file => {
        if(file.startsWith(dir)) {
          machine.dirs[dir] += machine.files[file]
        }
      })
    })
  }
}

const machine = new Linux()

log.forEach(log => machine.logAnalyzer(log))

machine.computeDirSize()

// Print files
//console.log('FILES')
//Object.keys(machine.files).sort().forEach(file => console.log(file, machine.files[file]))

// Print files
//console.log('DIR')
//Object.keys(machine.dirs).sort().forEach(dir => console.log(dir, machine.dirs[dir]))

// Sum dirs at most 100 000
const sum = 
  Object.keys(machine.dirs)
    .filter(dir => machine.dirs[dir] <= 100000)
    .map(dir => machine.dirs[dir])
    .reduce((a, i) => a + i, 0)

console.log('SUM < 100K:', sum)

const TOTAL = 70000000
const FREE  = 30000000
const USED  = machine.dirs['/']

console.log('Used space:\t', USED)
console.log('Free space:\t', TOTAL - USED)

const NEED_FREE = FREE - (TOTAL - USED)

console.log('Need to free:\t', NEED_FREE)

const smallestDir = 
  Object.keys(machine.dirs)
    .map(dir => machine.dirs[dir])
    .filter(size => size > NEED_FREE)
    .sort((a, b) => a - b)

console.log('SMALLEST DIR:\t', smallestDir[0])