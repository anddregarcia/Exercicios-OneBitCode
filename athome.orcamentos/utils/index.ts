export function formatCurrency(value: number | string, locale = 'pt-BR', currency = 'BRL') {
  const amount = typeof value === 'number' ? value : Number(value || 0);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(Number.isFinite(amount) ? amount : 0);
}

export function formatDate(value: string | Date, locale = 'pt-BR') {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(locale).format(date);
}
