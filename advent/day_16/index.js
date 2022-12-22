const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

// Parse input to objects
const data = input
  .split('\n')
  .map(v => {
    const name = v.split(' ')[1]
    const rate = parseInt(
      v.slice(
        v.indexOf('=') + 1, 
        v.indexOf(';')
      )
    )
    const tunnels = v.split('to valve')[1]
      .replace('s ', '')
      .trim()
      .split(', ')
    return {
      name,
      rate,
      tunnels
    }
  })

// Node
class Valve {
  constructor(name, rate) {
    this.name = name;
    this.rate = rate;
    this.tunnels = []
    this.distance = null
    this.isOpen = false
  }
  open(currentTime) {
    if (this.isOpen) {
      throw `Valve ${this.name} already opened`
    }
    this.isOpen = true
    return (currentTime - this.distance - 1) * this.rate
  }
  getEffort() {
    return this.distance + 1
  }
  getTotalPressure(currentTime) {
    return (currentTime - this.distance - 1) * this.rate
  }
  desc(currentTime) {
    return `${this.name}: d:${this.distance} r:${this.rate} p:${this.getTotalPressure(currentTime)}`
  }
}

// Create graph
const valves = data.reduce(
  (g, v) => Object.assign(g, {[v.name]: new Valve(v.name, v.rate)}),
  {}
)

// Create edges
data.forEach(v => {
  valves[v.name].tunnels = v.tunnels.map(n => valves[n])
})

// Set .distance on each valve as a distance from startValve
const computeDistance = (startValve) => {
  const q = []
  startValve.distance = 0
  q.push(startValve)
  while(q.length > 0) {
    const curValve = q[0]
    q.push(...curValve.tunnels.filter(n => n.distance == null).map(n => {
      n.distance = curValve.distance + 1
      return n
    }))
    q.shift()
  }
}

// Set .distance to null
const clearDistance = (valves) => {
  Object.values(valves).forEach(v => {v.distance = null})
}

// Set .isOpen to false
const closeAllValves = (valves) => {
  Object.values(valves).forEach(v => {v.isOpen = false})
}

const partOneGuide = () => {
  let time = 30
  let currentValve = valves['AA']
  let totalPressure = 0

  // 1 is for open, 0 - not open
  const guide = ['DD-1', 'CC-0', 'BB-1', 'AA-0', 'II-0', 'JJ-1', 'II-0', 'AA-0', 'DD-0', 'EE-0', 'FF-0', 'GG-0', 'HH-1', 'GG-0', 'FF-0', 'EE-1', 'DD-0', 'CC-1',]

  while (time > 0) {
    clearDistance(valves)
    computeDistance(currentValve)

    if (guide.length == 0) {
      break
    }

    const nextMove = guide.shift().split('-')
    const nextValve = valves[nextMove[0]]
    const nextOpen = nextMove[1] == '1'

    if(!nextValve) {
      break
    }

    if (nextOpen) {
      // console.log(currentValve.name, '>>', nextValve.name, nextValve.getTotalPressure(time), -nextValve.getEffort())
      totalPressure = totalPressure + nextValve.open(time)
      time = time - nextValve.getEffort()
    } else {
      // console.log(currentValve.name, '>>', nextValve.name, 0, -nextValve.distance)
      time = time - nextValve.distance
    }

    currentValve = nextValve
  }

  return totalPressure
}

const partOneGreedy = () => {
  let time = 30
  let currentValve = valves['AA']
  let totalPressure = 0

  while (time > 0) {
    clearDistance(valves)
    computeDistance(currentValve)

    // Greedy algorithm, max TOTAL PRESSURE IS 1595
    const nextValve = Object.values(valves)
      .filter(v => !v.isOpen)
      .sort((v1, v2) => v2.getTotalPressure(time) - v1.getTotalPressure(time))[0]

    if(!nextValve) {
      break
    }

    // console.log(currentValve.name, '>>', nextValve.name, nextValve.getTotalPressure(time), -nextValve.getEffort())
    totalPressure = totalPressure + nextValve.open(time)
    time = time - nextValve.getEffort()
    currentValve = nextValve
  }

  return totalPressure
}

// Help from:
// https://github.com/rishab1065/AdventOfCode/blob/master/2022/Day16/part1.js
const partOneBacktracking = () => {
  let time = 30
  const startValve = valves['AA']
  const cache = {}

  const maxPressure = (valve, alreadyOpen, timeLeft, track) => {
    // No time left
    if (timeLeft <= 0) {
      return 0
    }
    // Check cache
    const key = `${valve.name}-${timeLeft}-${alreadyOpen.sort().join(',')}`
    const cacheData = cache[key]
    if (cacheData) {
      return cacheData
    }
    let max = 0
    // If the valve is not open already and got positive rate
    if (!alreadyOpen.includes(valve.name) && valve.rate > 0) {
      const pressure = (timeLeft - 1) * valve.rate
      // Open valve and start over
      max = Math.max(
        max,
        pressure + maxPressure(valve, [...alreadyOpen, valve.name], timeLeft - 1)
      )
    }
    // Go deep
    valve.tunnels.forEach(nextValve => {
      max = Math.max(
        max,
        maxPressure(nextValve, alreadyOpen, timeLeft - 1)
      )
    })
    // Save cache
    cache[key] = max
    // Return max from given vales
    return max
  }

  return maxPressure(startValve, [], time)
}

// // Only for test data
// console.time('guide')
// console.log('TOTAL PRESSURE [guide]', partOneGuide())
// console.timeEnd('guide')

closeAllValves(valves)
clearDistance(valves)

console.time('greedy')
console.log('TOTAL PRESSURE [greedy]', partOneGreedy())
console.timeEnd('greedy')

console.time('backtracking')
console.log('TOTAL PRESSURE [backtracking]', partOneBacktracking())
console.timeEnd('backtracking')

// NOT WORKING
const partTwo = () => {
  let time = 26
  const p1 = valves['AA']
  const p2 = valves['AA']
  const cache = {}
  let cc = 0

  const maxPressure = (p1, p2, alreadyOpen, timeLeft) => {
    if (++cc % 1000000 == 0) {
      console.log(`${cc}`);
    }
    // No time left
    if (timeLeft <= 0) {
      return 0
    }
    // Check cache
    const key = `${[p1.name, p2.name].sort().join(',')}-${timeLeft}-${alreadyOpen.sort().join(',')}`
    const cacheData = cache[key]
    if (cacheData) {
      return cacheData
    }
    let max = 0

    // If they are on the same valve
    if (p1.name == p2.name) {

      // If the valve is not open already and got positive rate
      if (!alreadyOpen.includes(p1.name) && p1.rate > 0) {
        const pressure = (timeLeft - 1) * p1.rate
        // One of the open valve, second goes further
        p1.tunnels.forEach(nextValve => {
          max = Math.max(
            max,
            pressure + maxPressure(p1, nextValve, [...alreadyOpen, p1.name], timeLeft - 1)
          )
        })
      }

      p1.tunnels.forEach(nextP1 => {
        p2.tunnels.forEach(nextP2 => {
          max = Math.max(
            max,
            maxPressure(nextP1, nextP2, [...alreadyOpen], timeLeft - 1)
          )
        })
      })
      
     } else { // They are on different valve

      // If the valve is not open already and got positive rate
      if (!alreadyOpen.includes(p1.name) && p1.rate > 0) {
        const pressure = (timeLeft - 1) * p1.rate
        // One of the open valve, second goes further
        p2.tunnels.forEach(nextValve => {
          max = Math.max(
            max,
            pressure + maxPressure(p1, nextValve, [...alreadyOpen, p1.name], timeLeft - 1)
          )
        })
      }

      // If the valve is not open already and got positive rate
      if (!alreadyOpen.includes(p2.name) && p2.rate > 0) {
        const pressure = (timeLeft - 1) * p2.rate
        // One of the open valve, second goes further
        p1.tunnels.forEach(nextValve => {
          max = Math.max(
            max,
            pressure + maxPressure(nextValve, p2, [...alreadyOpen, p2.name], timeLeft - 1)
          )
        })
      }

      p1.tunnels.forEach(nextP1 => {
        p2.tunnels.forEach(nextP2 => {
          max = Math.max(
            max,
            maxPressure(nextP1, nextP2, [...alreadyOpen], timeLeft - 1)
          )
        })
      })

    }
    
   
    // Save cache
    cache[key] = max
    // Return max from given vales
    return max
  }

  return maxPressure(p1, p2, [], time)
}

// console.time('backtracking')
// console.log('TOTAL PRESSURE WITH ELEPHANT', partTwo())
// console.timeEnd('backtracking')
