## Install

```bash
npm install @ahmadnassri/debug
```

## Usage

Follows the exact same behaviour as [`util.debuglog`][debuglog] with some minor differences:

- checks for both `DEBUG` and `NODE_DEBUG` environment variables
- checks environment variables every time `debuglog()` is called _(vs. on `require`/ `import`)_
- regex matching in the environment variables
- no global caching _(you can change the behaviour every time `debuglog()` is called)_
- optionally include performance time in output
- optionally include process id in output

### debug(section, options)

| Option    | Type         | Description                        | Default         |
| --------- | ------------ | ---------------------------------- | --------------- |
| `section` | `<string>`   | The section name                   |                 |
| `logger`  | `<Function>` | Custom logger function             | `console.debug` |
| `pid`     | `<boolean>`  | Include process id in output       | `true`          |
| `perf`    | `<boolean>`  | Include performance time in output | `false`         |

> Returns: `<Function>` The logging function

The `debuglog()` method is used to create a function that conditionally writes debug messages to stderr based on the existence of the `DEBUG` or `NODE_DEBUG` environment variables. If the section name appears within the value of that environment variable, then the returned function operates similar to [`console.debug()`][console-debug]. If not, then the returned function is a no-op.

### Environment Variables

| Variable       | Description                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------ |
| `DEBUG`        | A comma-separated list of section names to enable                                                |
| `NODE_DEBUG`   | A comma-separated list of section names to enable                                                |
| `DEBUG_COLORS` | Enable/disable colors in output _(will also respect Node's `NO_COLORS` & `NODE_DISABLE_COLORS`)_ |
| `DEBUG_PERF`   | Include/exclude performance time in output _(⚠️ will overwrite `perf` option)_                   |
| `DEBUG_PID`    | Include/exclude process id in output _(⚠️ will overwrite `pid` option)_                          |

###### Examples

```js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo')

debug('hello from foo [%d]', 123)
```

If this program is run with `DEBUG=foo` or `NODE_DEBUG=foo` in the environment, then it will output something like:

```plain
FOO 3245: hello from foo [123]
```

where 3245 is the process id. If it is not run with that environment variable set, then it will not print anything.

#### Multiple Sections

Multiple `section` names may be specified in the environment variable, separated by commas, or spaces.

###### Example

```shell
DEBUG=fs,net,tls
```

#### Regex Matching

`section` names in the environment variable, can also be a regex string:

###### Example

```js
const debuglog = require('@ahmadnassri/debug')
const primary = debuglog('foo:primary')
const secondary = debuglog('foo:secondary')

primary('primary logger')
secondary('secondary logger')
```

```shell
$ NODE_DEBUG=foo:.* node app.js

FOO:PRIMARY 28382 primary logger
FOO:SECONDARY 28382 secondary logger
```

###### Get Fancy

```shell
$ DEBUG="(F|O)+:.*" node app.js

FOO:PRIMARY 28274 primary logger
FOO:SECONDARY 28274 secondary logger
```

#### remove PID

```js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo', { pid: false })

debug('hello from foo [%d]', 123)
```

```plain
FOO: hello from foo [123]
```

#### add Performance Time

```js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo', { perf: true })

debug('hello from foo [%d]', 123)
```

```plain
FOO 3245 (65ms) hello from foo [123] +0ms
```

#### Disable Colors

```shell
$ DEBUG_COLORS=0 node app.js
```

#### Disable Performance Time

```shell
$ DEBUG_PERF=0 node app.js
```

[debuglog]: https://nodejs.org/api/util.html#utildebuglogsection-callback
[console-debug]: https://nodejs.org/api/console.html#consoledebugdata-args
