const browserify = require('browserify')
const fs = require('fs')
const temp = require('fs-temp/promise')
const path = require('path')
const writeJsonFile = require('write-json-file').default

/**
 * @typedef {object} Options
 * @property {string[]} [permissions]
 */

/**
 * @param {Options} options
 * @param {string[]} contentScripts
 */
exports.build = async function build (options, ...contentScripts) {
  const library = path.join(__dirname, 'library.js')

  const b = browserify()
  const dir = await temp.mkdir()

  const bundleFileName = path.join(dir, 'content.js')
  const manifestFileName = path.join(dir, 'manifest.json')

  b.add(library)
  b.add(contentScripts)

  const stream = b.bundle()
  const output = fs.createWriteStream(bundleFileName)

  stream.pipe(output)
  stream.on('error', err => output.destroy(err))

  await new Promise((resolve, reject) => {
    output.on('error', reject)
    output.on('close', resolve)
  })

  await writeJsonFile(manifestFileName, {
    manifest_version: 2,
    name: 'wext-test',
    version: '1.0',
    description: 'wext-test',
    content_scripts: [{
      matches: ['http://localhost/*'],
      js: ['content.js']
    }],
    permissions: options.permissions || []
  })

  return dir
}
