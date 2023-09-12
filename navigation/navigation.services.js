const puppeteer = require('puppeteer');
const difference = require('./../helpers/difference');
const delay = require('./../helpers/delay');

require('dotenv').config();

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

module.exports = { start, end, toDate, toStore, closeStore };

async function start(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  //iniciar sesion
  await page.type('#E-mail', email);
  await page.type('#Contraseña', password);
  await page.click('.par-button');

  //cambiar resolucion a 1920x1080
  await page.waitForSelector('.content');
  await page.setViewport({ width: 1920, height: 1080 });

  return { browser, page };
}

async function toDate(page, fecha) {
  //seleccionar todas las tiendas
  await page.click('.multi-store');
  await page.click(
    '.par-checkbox-group-all__select-all.par-checkbox-group-all__select-all:nth-child(1)'
  );

  //Selecciona seccion fecha personalizada
  await page.waitForSelector(
    '.par-icon.par-icon--medium.time-period-trigger-icon'
  );
  await page.click('.par-icon.par-icon--medium.time-period-trigger-icon');
  await delay.time(1000);
  await page.click('.par-chip:nth-child(2)');

  //Encuentra cual es el mes que aparece en pantalla
  await page.waitForSelector('.vc-title');
  const monthDiv = await page.$('.vc-title');
  const glovoDate = await page.evaluate(
    (element) => element.textContent,
    monthDiv
  );

  //calcula la diferencia entre el mes actual y el indicado y cambia al indicado
  const result = await difference.betweenMonths(glovoDate, fecha);
  if (result != 0) {
    await page.waitForSelector('.vc-arrow.is-left');
    for (let i = 0; i < result; i++) {
      await page.waitForSelector('.vc-arrow.is-left');
      await page.click('.vc-arrow.is-left');
      await delay.time(500);
    }
  }

  //selecciona el dia indicado
  await page.waitForSelector(`.id-${fecha}`);
  await page.click(`.id-${fecha}`);
  await page.click(`.id-${fecha}`);

  //selecciona la pestaña de direcciones
  await page.click('.address-selector');
  await page.click(
    '.checkbox.par-checkbox-group-all__select-all.par-checkbox-group-all__select-all'
  );
}

async function toStore(page, store) {
  //click 3 veces para seleccionar todo
  const input = await page.$(
    '.input-margin-left.input-padding-right.par-dsv.par-dsv--open.image-spacing'
  );
  await input.click({ clickCount: 3 });

  //escribe el nombre de la tienda y la selecciona
  await input.type(`${store}`, { delay: 40 });
  await page.waitForSelector(`li ::-p-text(${store})`);
  await page.click(`li ::-p-text(${store})`);
}

async function closeStore(page) {
  await page.waitForSelector('.checkbox.par-checkbox-group-all__select-all');
  await page.click('.checkbox.par-checkbox-group-all__select-all');
}

async function end(browser) {
  browser.close();
}
