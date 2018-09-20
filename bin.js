#!/usr/bin/env node

const http = require('http')
const neodoc = require('neodoc')
const { By, until } = require('selenium-webdriver')
const tapMerge = require('tap-merge')

const extension = require('./lib/extension')

function createDriver (browser, extensionDirectory) {
  if (browser === 'chrome') return require('./lib/chrome').createDriver(extensionDirectory)
  if (browser === 'firefox') return require('./lib/firefox').createDriver(extensionDirectory)
}

async function run (output, port, browser, extensionDirectory) {
  const driver = await createDriver(browser, extensionDirectory)

  try {
    await driver.get(`http://localhost:${port}`)

    // Output tap results from the connected browser.
    const el = await driver.wait(until.elementLocated(By.id('test-results')), 10000)
    const testResults = await el.getAttribute('textContent')

    output.write(`# ${browser[0].toUpperCase()}${browser.slice(1)}\n${testResults}\n`)
  } finally {
    await driver.quit()
  }
}

async function main (args) {
  const contentScripts = args['<file>'] || ['test.js']
  const browsers = [args['--chrome'] ? 'chrome' : null, args['--firefox'] ? 'firefox' : null].filter(Boolean)

  if (browsers.length === 0) {
    browsers.push('chrome', 'firefox')
  }

  const options = { permissions: args['--permission'] }
  const extensionDirectory = await extension.build(options, ...contentScripts)

  const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf8')
    res.end('<!DOCTYPE html><html><head><title>@wext/test</title></head><body><h1>@wext/test</h1></body></html>')
  })

  const output = tapMerge()

  output.pipe(process.stdout)

  await new Promise((resolve) => {
    server.listen(29420, resolve)
  })

  try {
    await Promise.all(browsers.map((browser) => {
      return run(output, 29420, browser, extensionDirectory)
    }))
  } finally {
    server.close()
  }

  output.end()
}

const args = neodoc.run(`
Web Extension Test

Usage:
  wext-test [options] <file>...
  wext-test -h | --help
  wext-test --version

Options:
  -h --help              Show this screen.
  --version              Show version.
  --chrome               Test in Chrome.
  --firefox              Test in Firefox.
  --permission=VALUE...  Add the specified permission to the extension.
`)

main(args).catch((err) => {
  process.exitCode = 1
  console.error(err.stack)
})
