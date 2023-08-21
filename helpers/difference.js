module.exports = { betweenMonths };

async function betweenMonths(fecha) {
  const todayDate = new Date();
  const todayMonth = todayDate.getMonth();
  const fechaMonth = Number(fecha.slice(5, 7));

  const different = todayMonth - fechaMonth + 1;
  return different;
}
