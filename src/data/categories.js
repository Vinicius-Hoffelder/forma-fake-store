// Categorias da loja
export const categories = [
  { value: "electronics", label: "Eletrônicos" },
  { value: "jewelery", label: "Joias" },
  { value: "men's clothing", label: "Masculino" },
  { value: "women's clothing", label: "Feminino" },
];

export function categoryLabel(category) {
  return categories.find((item) => item.value === category)?.label ?? category;
}
