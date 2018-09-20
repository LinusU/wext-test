# Web Extensions - Test

A tool for testing web extensions in multiple browsers. Currently Firefox and Chrome is implemented.

## Installation

```sh
npm install --save-dev @wext/test
```

## Usage

This tool uses [`mocha`](https://github.com/mochajs/mocha) to run your tests inside of a temporary created extension. The test output will be streamed as [TAP output](http://testanything.org) to stdout.

Just write your tests as you would normally do with Mocha, and run `wext-test` specifiying which test files to run. By default it will run on all supported browsers, to run only on e.g. Firefox pass the `--firefox` flag.

We recommend using [`tap-mocha-reporter`](https://github.com/tapjs/tap-mocha-reporter) in order to get pretty test output.

```json
  "scripts": {
    "test": "wext-test test/*.js | tap-mocha-reporter spec"
  }
```

For full usage, run `wext-test --help`.
