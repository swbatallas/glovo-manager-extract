const months = require('../months');

module.exports = { betweenMonths };

async function betweenMonths(glovoDate, fecha) {
  //obtenemos el mes de la fecha que queremos obtener el informe
  const fechaMonth = Number(fecha.slice(5, 7));
  //obtenemos el mes de inicio de glovo
  let glovoMonth = glovoDate.split(' ');
  glovoMonth = glovoMonth[0];
  for (month in months) {
    if (month == glovoMonth) glovoMonth = months[month];
  }

  const different = glovoMonth - fechaMonth;
  console.log(different);
  return different;
}
