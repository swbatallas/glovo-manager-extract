const extraction = require('./extraction');

async function getRefunds() {
  for (let i = 1; i <= 10; i++) {
    console.log(i);
    if (i < 10) {
      await extraction.refunds(`2023-09-0${i}`, 'items');
    } else await extraction.refunds(`2023-09-${i}`, 'items');
  }
}

async function getRefunds() {
  for (let i = 1; i <= 10; i++) {
    console.log(i);
    if (i < 10) {
      await extraction.refunds(`2023-09-0${i}`, 'items');
    } else await extraction.refunds(`2023-09-${i}`, 'items');
  }
}

async function getProducts() {
  for (let i = 1; i <= 10; i++) {
    console.log(i);
    if (i < 10) {
      await extraction.refunds(`2023-09-0${i}`);
    } else await extraction.refunds(`2023-09-${i}`);
  }
}

getProducts();