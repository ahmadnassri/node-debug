# node-debug [![version][npm-version]][npm-url] [![License][license-image]][license-url]

> Debugging utility using environment regex, matches node core's debugging technique.

[![Build Status][travis-image]][travis-url]
[![Downloads][npm-downloads]][npm-url]
[![Code Climate][codeclimate-quality]][codeclimate-url]
[![Coverage Status][codeclimate-coverage]][codeclimate-url]
[![Dependency Status][dependencyci-image]][dependencyci-url]
[![Dependencies][david-image]][david-url]

## Install

```bash
npm install --only=production --save @ahmadnassri/debug
```

## Usage

`node-debug` follows the exact same behaviour as [`util.debuglog`][debuglog] with some minor differences:

- checks for both `DEBUG` and `NODE_DEBUG` environment variables
- checks environment variables everytime `debug()` is called _(vs. on `require`)_
- regex matching in the environment variables
- no global caching _(you can change the behaviour after `require` everytime `debug()` is called)_

### debug(section)

- `section`: `<string>` A string identifying the portion of the application for which the logging function is being created.
- Returns: `<Function>` The logging function

`debug()` is used to create a function that conditionally writes debug messages to `stderr` based on the existence of the `NODE_DEBUG` or `DEBUG` environment variables. If the `section` name appears within the value of that environment variables, then the returned function operates similar to `console.error()`. If not, then the returned function is a no-op.

###### Example:

```js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo')

debug('hello from foo [%d]', 123)
```

If this program is run with `NODE_DEBUG=foo` in the environment, then it will output something like:

```
FOO 3245: hello from foo [123]
```
where 3245 is the process id. If it is not run with that environment variable set, then it will not print anything.

#### Multiple Sections

Multiple `section` names may be specified in the `NODE_DEBUG` environment variable, separated by commas, or spaces.

###### Example: 

```
NODE_DEBUG=fs,net,tls
```

#### Regex Matching

`section` names in the `NODE_DEBUG` environment variable, can also be a regex string:

###### Example: 

```js
const debuglog = require('@ahmadnassri/debug')
const primary = debuglog('foo:primary')
const secondary = debuglog('foo:secondary')

primary('primary logger')
secondary('secondary logger')
```

```shell
$ NODE_DEBUG=foo:.* node app.js

FOO:PRIMARY 28382: primary logger
FOO:SECONDARY 28382: secondary logger
```

###### Get Fancy:

```shell
$ DEBUG="(F|O)+:.*" node app.js

FOO:PRIMARY 28274: primary logger
FOO:SECONDARY 28274: secondary logger
```

---
> :copyright: [ahmadnassri.com](https://www.ahmadnassri.com/) · 
> License: [ISC][license-url] · 
> Github: [@ahmadnassri](https://github.com/ahmadnassri) · 
> Twitter: [@ahmadnassri](https://twitter.com/ahmadnassri)

[license-url]: http://choosealicense.com/licenses/isc/
[license-image]: https://img.shields.io/github/license/ahmadnassri/node-debug.svg?style=flat-square

[travis-url]: https://travis-ci.org/ahmadnassri/node-debug
[travis-image]: https://img.shields.io/travis/ahmadnassri/node-debug.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/@ahmadnassri/debug
[npm-version]: https://img.shields.io/npm/v/@ahmadnassri/debug.svg?style=flat-square
[npm-downloads]: https://img.shields.io/npm/dm/@ahmadnassri/debug.svg?style=flat-square

[codeclimate-url]: https://codeclimate.com/github/ahmadnassri/node-debug
[codeclimate-quality]: https://img.shields.io/codeclimate/github/ahmadnassri/node-debug.svg?style=flat-square
[codeclimate-coverage]: https://img.shields.io/codeclimate/coverage/github/ahmadnassri/node-debug.svg?style=flat-square

[david-url]: https://david-dm.org/ahmadnassri/node-debug
[david-image]: https://img.shields.io/david/ahmadnassri/node-debug.svg?style=flat-square

[dependencyci-url]: https://dependencyci.com/github/ahmadnassri/node-debug
[dependencyci-image]: https://dependencyci.com/github/ahmadnassri/node-debug/badge?style=flat-square

[debuglog]: https://nodejs.org/api/util.html#util_util_debuglog_section
