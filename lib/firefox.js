const geckodriver = require('geckodriver')
const { Builder } = require('selenium-webdriver')
const firefox = require('selenium-webdriver/firefox')
const { Command } = require('selenium-webdriver/lib/command')

/**
 * @param {string} extensionDirectory
 */
exports.createDriver = async function createFirefoxDriver (extensionDirectory) {
  const options = new firefox.Options()

  if (Boolean(process.env.HEADLESS)) {
    options.headless()
  }

  const driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .setFirefoxService(new firefox.ServiceBuilder(geckodriver.path))
    .build()

  const command = new Command('install addon')
    .setParameter('path', extensionDirectory)
    .setParameter('temporary', true)

  await driver.execute(command)

  return driver
}
