export function formatToDolar(value: number): string {
  const USDFormat = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  })

  return USDFormat.format(value)
}
