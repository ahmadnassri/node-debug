# Node Debug

Debugging utility using environment regex, matches node core’s debugging technique

[![license][license-img]][license-url]
[![release][release-img]][release-url]
[![semantic][semantic-img]][semantic-url]

## Install

``` bash
npm install @ahmadnassri/debug
```

## Usage

Follows the exact same behaviour as [`util.debuglog`][] with some minor differences:

- checks for both `DEBUG` and `NODE_DEBUG` environment variables
- checks environment variables every time `debuglog()` is called *(vs. on `require`/ `import`)*
- regex matching in the environment variables
- no global caching *(you can change the behaviour every time `debuglog()` is called)*
- optionally include performance time in output
- optionally include process id in output

### debug(section, options)

| Option    | Type         | Description                        | Default         |
|-----------|--------------|------------------------------------|-----------------|
| `section` | `<string>`   | The section name                   |                 |
| `logger`  | `<Function>` | Custom logger function             | `console.debug` |
| `pid`     | `<boolean>`  | Include process id in output       | `true`          |
| `perf`    | `<boolean>`  | Include performance time in output | `false`         |

> Returns: `<Function>` The logging function

The `debuglog()` method is used to create a function that conditionally writes debug messages to stderr based on the existence of the `DEBUG` or `NODE_DEBUG` environment variables. If the section name appears within the value of that environment variable, then the returned function operates similar to [`console.error()`][]. If not, then the returned function is a no-op.

### Environment Variables

| Variable       | Description                                                                                      |
|----------------|--------------------------------------------------------------------------------------------------|
| `DEBUG`        | A comma-separated list of section names to enable                                                |
| `NODE_DEBUG`   | A comma-separated list of section names to enable                                                |
| `DEBUG_COLORS` | Enable/disable colors in output *(will also respect Node's `NO_COLORS` & `NODE_DISABLE_COLORS`)* |
| `DEBUG_PERF`   | Include/exclude performance time in output *(⚠️ will overwrite `perf` option)*                   |
| `DEBUG_PID`    | Include/exclude process id in output *(⚠️ will overwrite `pid` option)*                          |

###### Examples

``` js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo')

debug('hello from foo [%d]', 123)
```

If this program is run with `DEBUG=foo` or `NODE_DEBUG=foo` in the environment, then it will output something like:

``` plain
FOO 3245: hello from foo [123]
```

where 3245 is the process id. If it is not run with that environment variable set, then it will not print anything.

#### Multiple Sections

Multiple `section` names may be specified in the environment variable, separated by commas, or spaces.

###### Example

``` shell
DEBUG=fs,net,tls
```

#### Regex Matching

`section` names in the environment variable, can also be a regex string:

###### Example

``` js
const debuglog = require('@ahmadnassri/debug')
const primary = debuglog('foo:primary')
const secondary = debuglog('foo:secondary')

primary('primary logger')
secondary('secondary logger')
```

``` shell
$ NODE_DEBUG=foo:.* node app.js

FOO:PRIMARY 28382 primary logger
FOO:SECONDARY 28382 secondary logger
```

###### Get Fancy

``` shell
$ DEBUG="(F|O)+:.*" node app.js

FOO:PRIMARY 28274 primary logger
FOO:SECONDARY 28274 secondary logger
```

#### remove PID

``` js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo', { pid: false })

debug('hello from foo [%d]', 123)
```

``` plain
FOO: hello from foo [123]
```

#### add Performance Time

``` js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo', { perf: true })

debug('hello from foo [%d]', 123)
```

``` plain
FOO 3245 (65ms) hello from foo [123] +0ms
```

#### Disable Colors

``` shell
$ DEBUG_COLORS=0 node app.js
```

#### Disable Performance Time

``` shell
$ DEBUG_PERF=0 node app.js
```

  [`util.debuglog`]: https://nodejs.org/api/util.html#utildebuglogsection-callback
  [`console.error()`]: https://nodejs.org/api/console.html#consoleerrordata-args

----
> Author: [Ahmad Nassri](https://www.ahmadnassri.com/) &bull;
> Twitter: [@AhmadNassri](https://twitter.com/AhmadNassri)

[license-url]: LICENSE
[license-img]: https://badgen.net/github/license/ahmadnassri/node-debug

[release-url]: https://github.com/ahmadnassri/node-debug/releases
[release-img]: https://badgen.net/github/release/ahmadnassri/node-debug

[semantic-url]: https://github.com/ahmadnassri/node-debug/actions?query=workflow%3Arelease
[semantic-img]: https://badgen.net/badge/📦/semantically%20released/blue
