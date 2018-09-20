window.setTimeout = window.setTimeout.bind(window)
window.setInterval = window.setInterval.bind(window)
window.clearTimeout = window.clearTimeout.bind(window)
window.clearInterval = window.clearInterval.bind(window)

require('mocha/browser-entry')

const Base = require('mocha/lib/reporters/base')

let tapOutput = ''

function title(test) {
  return test.fullTitle().replace(/#/g, '')
}

class Reporter extends Base {
  constructor (runner) {
    super(runner)

    var n = 1
    var passes = 0
    var failures = 0

    runner.on('start', () => {
      var total = runner.grepTotal(runner.suite)
      tapOutput += `1..${total}\n`
    })

    runner.on('test end', () => {
      n += 1
    })

    runner.on('pending', (test) => {
      tapOutput += `ok ${n} ${title(test)} # SKIP -\n`
    })

    runner.on('pass', (test) => {
      passes++
      tapOutput += `ok ${n} ${title(test)}\n`
    })

    runner.on('fail', (test, err) => {
      failures++
      tapOutput += `not ok ${n} ${title(test)}\n`
      if (err.message) {
        tapOutput += `${err.message.replace(/^/gm, '  ')}\n`
      }
      if (err.stack) {
        tapOutput += `${err.stack.replace(/^/gm, '  ')}\n`
      }
    })

    runner.once('end', () => {
      tapOutput += `# tests ${passes + failures}\n`
      tapOutput += `# pass ${passes}\n`
      tapOutput += `# fail ${failures}\n`

      const result = document.createElement('div')

      result.id = 'test-results'
      result.textContent = tapOutput

      document.body.appendChild(result)
    })
  }
}

mocha.setup({ reporter: Reporter, ui: 'bdd' })

setTimeout(() => mocha.run(), 10)
