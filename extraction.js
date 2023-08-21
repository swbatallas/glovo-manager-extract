const navigation = require('./navigation/navigation.services');
const product = require('./product/product.services');
const stores = require('./stores');
module.exports = { run };

async function run(fecha) {
  const productsArray = [];
  const { browser, page } = await navigation.start();
  await navigation.toDate(page, fecha);
  const json = await product.check(page);
  console.log(json);
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
        await product.toExcel(productsArray, fecha);
      } else console.log(store + ' sin existencias');
      await navigation.closeStore(page);
    }
  }
  navigation.end(browser);
}
