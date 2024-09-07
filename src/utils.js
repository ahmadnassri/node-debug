const reset = '\x1b[0m'
const yellow = '\x1b[33m'
const dim = '\x1b[2m'

function bool (str) {
  return str !== undefined && (str.toLowerCase() === 'true' || str === '1')
}

// follow Node.js color conventions
const noColors =
  process.env.NO_COLOR ||
  process.env.NODE_DISABLE_COLORS ||
  bool(process.env.DEBUG_COLORS) === false

module.exports = {
  bool,
  yellow: (str) => noColors ? str : `${dim}${yellow}${str}${reset}`,
  dim: (str) => noColors ? str : `${dim}${str}${reset}`
}
