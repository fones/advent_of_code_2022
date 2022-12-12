
const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' })

const elevation = 'abcdefghijklmnopqrstuvwxyz'
let START = [null, null]
let END = [null, null]

// Sabc...
const areaAZ = input.split('\n').map(r => r.split(''))

// 0, 1, 2, 3, ...
const area = areaAZ
  .map((row, r) => row.map((e, c) => {
    // START
    if (e == 'S') {
      START = [r, c]
      // Your current position (S) has elevation a,
      return elevation.indexOf('a') 
    // END
    } else if (e == 'E') {
      END = [r, c]
      // and the location that should get the best signal (E) has elevation z.
      return elevation.indexOf('z')
    // abce...
    } else {
      return elevation.indexOf(e)
    }
  }))

// console.log(area);
// console.log('START', START)
// console.log('END', END);

const nextStep = ([r, c]) => {
  const elevation = area[r][c]
  const next = []
  const moves = [
    [r - 1, c],
    [r + 1, c],
    [r, c - 1],
    [r, c + 1]
  ]
  moves.forEach(([i, j]) => {
    if (i >= 0 && j >= 0 && i < area.length && j < area[0].length) {
      const nextElevation = area[i][j]
      if (nextElevation <= elevation + 1) {
        next.push([i, j])
      }
    }
  })
  return next
}

// console.log('NEXT of', nextStep([0,0]));

const graph = {}

// NODES
area.forEach((row, r) => row.forEach((e, c) => {
  graph[r] = graph[r] || {}
  graph[r][c] = new Object({
    r,
    c,
    label: areaAZ[r][c],
    elevation: area[r][c],
    next: [],
    steps: null
  })
}))

// EDGES
area.forEach((row, r) => row.forEach((_e, c) => {
  const next = nextStep([r, c]).map(([i, j]) => graph[i][j])
  graph[r][c].next.push(...next)
}))

// Breadth First Search
const bfs = (g, [sx, sy]) => {
  const q = []
  const startNode = graph[sx][sy]
  startNode.steps = 0
  q.push(startNode)
  while(q.length > 0) {
    const node = q[0]
    if (node.label == 'E') {
      return node.steps
    }
    q.push(...node.next.filter(n => n.steps == null).map(n => {
      n.steps = node.steps + 1
      return n
    }))
    q.shift()
  }
}

console.log("STEPS FROM START:", bfs(graph, START))

// Clear steps
area.forEach((row, r) => row.forEach((_e, c) => graph[r][c].steps = null))

// Select starting points
const STARTING_POINTS = []

area.forEach((row, r) => row.forEach((_e, c) => {
  if (graph[r][c].elevation == 0) {
    STARTING_POINTS.push([r, c])
  }
}))

// console.log('STARTING_POINTS:', STARTING_POINTS)

const RESULTS = []

STARTING_POINTS.forEach(s => {
  // Check steps
  RESULTS.push(bfs(graph, s))
  // Clear steps
  area.forEach((row, r) => row.forEach((_e, c) => graph[r][c].steps = null))
})

console.log('BEST RESULT:', RESULTS.sort()[0])