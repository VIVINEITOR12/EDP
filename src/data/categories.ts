// Centralized category definitions for the entire application
export const CATEGORIES = {
  "mujeres": {
    name: "Mujeres",
    subcategories: [
      { key: "casual", name: "Casual" },
      { key: "vestidos", name: "Vestidos" },
      { key: "pantalones", name: "Pantalones" },
      { key: "chaquetas", name: "Chaquetas" },
      { key: "sport", name: "Sport" },
      { key: "interior", name: "Interior" },
      { key: "baño", name: "Baño" },
      { key: "formal", name: "Formal" }
    ]
  },
  "hombres": {
    name: "Hombres", 
    subcategories: [
      { key: "camisas", name: "Camisas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "chaquetas", name: "Chaquetas" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "polos", name: "Polos" },
      { key: "sport", name: "Sport" },
      { key: "baño", name: "Baño" },
      { key: "formal", name: "Formal" }
    ]
  },
  "ninos": {
    name: "Niños",
    subcategories: [
      { key: "camisas", name: "Camisas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "uniformes", name: "Uniformes" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "sport", name: "Sport" },
      { key: "temporada", name: "Temporada" }
    ]
  },
  "ninas": {
    name: "Niñas",
    subcategories: [
      { key: "vestidos", name: "Vestidos" },
      { key: "blusas", name: "Blusas" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "escolar", name: "Escolar" },
      { key: "sport", name: "Sport" },
      { key: "baño", name: "Baño" },
      { key: "accesorios", name: "Accesorios" }
    ]
  }
};

export const getCategoryName = (categoryKey: string): string => {
  return CATEGORIES[categoryKey as keyof typeof CATEGORIES]?.name || categoryKey;
};

export const getSubcategoryName = (categoryKey: string, subcategoryKey: string): string => {
  const category = CATEGORIES[categoryKey as keyof typeof CATEGORIES];
  if (!category) return subcategoryKey;
  
  const subcategory = category.subcategories.find(sub => sub.key === subcategoryKey);
  return subcategory?.name || subcategoryKey;
};

export const getSubcategoriesForCategory = (categoryKey: string) => {
  return CATEGORIES[categoryKey as keyof typeof CATEGORIES]?.subcategories || [];
};