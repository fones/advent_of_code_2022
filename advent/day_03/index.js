const fs = require('fs');

const input = fs.readFileSync('./input.txt', { encoding: 'utf8' });

const prior = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const errors = 
  input
    .split('\n')
    .map(e => {
      const half = e.length / 2
      return [
        e.slice(0, half), 
        e.slice(-1 * half)
      ]
    })
    .map(([e1, e2]) => [
      Array.from(e1),
      Array.from(e2)
    ])
    .map(([e1, e2]) => {
      const dd = {}
      let er = null
      e1.forEach(i => dd[i] = dd[i] || 1)
      e2.forEach(i => dd[i] ? er = i : null)
      return er
    })
    .map(e => prior.indexOf(e) + 1)
    .reduce((a, e) => a + e, 0)

console.log('SUM of errors:', errors)

const badges =
  input
    .split('\n')
    .map(e => Array.from(e))
    .reduce((a, e, i) => {
        if (i % 3) {
          a[a.length - 1].push(e)
        } else { 
          a.push([e])
        }
        return a
    }, [])
    .map((e) => {
      let d1 = e[0].reduce((a, i) => (a[i] = true, a), {})
      let d2 = e[1].reduce((a, i) => (a[i] = true, a), {})
      let [b] = e[2].filter(i => d1[i] && d2[i])
      return b
    }, [])
    .map(e => prior.indexOf(e) + 1)
    .reduce((a, e) => a + e, 0)

console.log('SUM of badges:', badges)
