const info = (...params) => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const errorLog = (...params) => {
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV !== 'test') {
    console.error(...params)
  }
}

module.exports = {
  info, errorLog
}