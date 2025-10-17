export function formatDateToSpanish(isoDate: string) {
  const date = new Date(isoDate);
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const day = date.getDate();
  const month = meses[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month}, ${year}`;
}