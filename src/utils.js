async function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 *
 * @param {number} ms
 * @param {Function} fn
 */
async function infiniteLoop(ms, fn) {
  if (ms < 1) {
    throw new TypeError(`ms must be greater than 1`);
  }
  while (true) {
    fn();
    await wait(ms);
  }
}

module.exports = {
  wait,
  infiniteLoop,
};
