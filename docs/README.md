## Install

```bash
npm install @ahmadnassri/debug
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

###### Example

```js
const debuglog = require('@ahmadnassri/debug')
const debug = debuglog('foo')

debug('hello from foo [%d]', 123)
```

If this program is run with `NODE_DEBUG=foo` in the environment, then it will output something like:

```plain
FOO 3245: hello from foo [123]
```

where 3245 is the process id. If it is not run with that environment variable set, then it will not print anything.

#### Multiple Sections

Multiple `section` names may be specified in the `NODE_DEBUG` environment variable, separated by commas, or spaces.

###### Example

```shell
NODE_DEBUG=fs,net,tls
```

#### Regex Matching

`section` names in the `NODE_DEBUG` environment variable, can also be a regex string:

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

FOO:PRIMARY 28382: primary logger
FOO:SECONDARY 28382: secondary logger
```

###### Get Fancy

```shell
$ DEBUG="(F|O)+:.*" node app.js

FOO:PRIMARY 28274: primary logger
FOO:SECONDARY 28274: secondary logger
```

[debuglog]: https://nodejs.org/api/util.html#util_util_debuglog_section
