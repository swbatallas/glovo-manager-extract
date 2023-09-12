const navigation = require('./navigation/navigation.services');
const product = require('./products/products.services');
const stores = require('./stores');
module.exports = { refunds, products };

const baseUrl = 'https://managers.glovoapp.com';

async function refunds(fecha) {
  //Modify the url to get the refunds
  let url = await new URL('/operations', baseUrl);

  const productsArray = [];
  const { browser, page } = await navigation.start(url);
  await navigation.toDate(page, fecha);
  const json = await product.check(page);

  if (json.items.length != 0) {
    // Get all the products in the store
    for (let i = 0; i < stores.length; i++) {
      const store = stores[i].address;
      console.log(store);
      await navigation.toStore(page, store);
      let json = await product.check(page, store);
      if (json.items.length != undefined) {
        json.tienda = store;
        await productsArray.push(json);
        await product.toExcel(productsArray, fecha, 'items');
      } else console.log(store + ' sin existencias');
      await navigation.closeStore(page);
    }
  }
  navigation.end(browser);
}

async function products(fecha) {
  // Modify the url to get the list of products
  let url = await new URL('/dashboard', baseUrl);

  const productsArray = [];
  const { browser, page } = await navigation.start(url);
  await navigation.toDate(page, fecha);
  for (let i = 0; i < stores.length; i++) {
    //establece el nombre de la tienda
    const store = stores[i].address;

    //click 3 veces para seleccionar todo
    const input = await page.$(
      '.input-margin-left.input-padding-right.par-dsv.par-dsv--open.image-spacing'
    );
    await input.click({ clickCount: 3 });

    //escribe el nombre de la tienda y la selecciona
    await input.type(`${store}`, { delay: 40 });
    await page.waitForSelector(`li ::-p-text(${store})`);
    await page.click(`li ::-p-text(${store})`);

    // espera a la respuesta
    try {
      httpResponseWeWaitForPromise = await page.waitForResponse((response) => {
        return response
          .url()
          .startsWith(
            'https://api.glovoapp.com/partners/dashboards/metrics/products/performance'
          );
      });
    } catch (error) {
      console.log('no llega la respuesta ' + error);
      tiendasFallidas.push(store);
      continue;
    }
    console.log(await httpResponseWeWaitForPromise.json());
    //pasa la respuesta a json

    let json = await httpResponseWeWaitForPromise.json();

    //comprueba si la respuesta contiene pedidos, y si es true, la añade al array
    if (json?.hasOrders == true) {
      json.tienda = store;
      console.log(json);
      await productsArray.push(json);

      //crea la pagina de excel con el array modificado
      await product.toExcel(productsArray, fecha, 'products');
    } else console.log(store + ' sin existencias');

    //espera al selector de todas las tiendas y lo deselecciona
    await page.waitForSelector('.checkbox.par-checkbox-group-all__select-all');
    await page.click('.checkbox.par-checkbox-group-all__select-all');
  }
  navigation.end(browser);
}
