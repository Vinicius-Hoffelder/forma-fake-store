// Preço em reais
const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatPrice(price) {
  return formatter.format(price);
}
