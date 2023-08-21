const xl = require('excel4node');
const url =
  'https://api.glovoapp.com/partners/dashboards/metrics/missing-wrong-items';

module.exports = { check, toExcel };

async function check(page) {
  //intenta obtener la respuesta del fetch
  try {
    httpResponseWeWaitForPromise = await page.waitForResponse((response) => {
      return response.url().startsWith(url);
    });
  } catch (error) {
    console.log('no llega la respuesta ' + error);
  }

  //pasa la respuesta a json
  let json = await httpResponseWeWaitForPromise.json();
  return json;
}

async function toExcel(data, date) {
  //crea el workbook del excel
  const wb = await new xl.Workbook();

  const ws = wb.addWorksheet(1);

  let celda = 1;

  const style = wb.createStyle({
    font: {
      color: '#000000',
      size: 10,
    },
  });

  //escribe los titulos de las celdas
  ws.cell(1, 1).string('tienda').style(style);
  ws.cell(1, 2).string('fecha').style(style);
  ws.cell(1, 3).string('producto').style(style);
  ws.cell(1, 4).string('cantidad').style(style);

  //escribe el contenido de las celdas por vaper
  for (let t = 0; t < data.length; t++) {
    let tienda = data[t].tienda;

    for (let i = 0; i < data[t].items.length; i++) {
      celda = celda + 1;
      const modelo = Object.values(data[t].items[i])[0];
      const cantidad = Object.values(data[t].items[i])[2];

      //escribe la fila con el nombre de la tienda, la date, el modelo y la cantidad
      ws.cell(celda, 1).string(tienda).style(style);
      ws.cell(celda, 2).string(date).style(style);
      ws.cell(celda, 3).string(modelo).style(style);
      ws.cell(celda, 4).number(cantidad).style(style);
    }
  }
  wb.write(`${date}.xlsx`);
}
