const extraction = require('./extraction');

async function run() {
  for (let i = 1; i <= 30; i++) {
    console.log(i);
    if (i < 10) {
      await extraction.run(`2023-06-0${i}`);
    } else await extraction.run(`2023-06-${i}`);
  }
}

run();
