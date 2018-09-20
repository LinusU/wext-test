const { Builder } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const chromedriver = require('chromedriver')
const isTravis = require('is-travis')

/**
 * @param {string} extensionDirectory
 */
exports.createDriver = async function createChromeDriver (extensionDirectory) {
  const options = new chrome.Options();
  options.addArguments(`--load-extension=${extensionDirectory}`)

  if (Boolean(process.env.HEADLESS)) {
    console.warn(`WARN: Chrome doesn't currently support extensions in headless mode. Falling back to non-headless mode`);
    // options.addArguments('--headless')
  }

  if (isTravis) {
    // See https://docs.travis-ci.com/user/chrome for a rationale.
    options.addArguments('--no-sandbox')
  }

  return new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .setChromeService(new chrome.ServiceBuilder(chromedriver.path))
    .build()
}
