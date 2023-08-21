function time(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

module.exports = { time };
