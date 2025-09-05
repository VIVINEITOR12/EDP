export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: {
    usd: number;
    bs: number;
  };
  rating: number;
  reviewCount: number;
  image: string;
  description?: string;
}

// Productos eliminados - ahora se cargan desde Supabase via admin panel
export const products: Product[] = [];

export const categories = {
  mujeres: {
    name: "Mujeres",
    subcategories: [
      { key: "vestidos", name: "Vestidos" },
      { key: "blusas", name: "Blusas" },
      { key: "faldas", name: "Faldas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "crop-tops", name: "Crop Tops" },
      { key: "conjuntos", name: "Conjuntos" }
    ]
  },
  hombres: {
    name: "Hombres",
    subcategories: [
      { key: "camisas", name: "Camisas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "sueteres", name: "Suéteres" },
      { key: "franelas", name: "Franelas" },
      { key: "shorts", name: "Shorts" }
    ]
  },
  ninos: {
    name: "Niños",
    subcategories: [
      { key: "camisas", name: "Camisas" },
      { key: "pantalones", name: "Pantalones" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "ropa-escolar", name: "Ropa Escolar" }
    ]
  },
  ninas: {
    name: "Niñas",
    subcategories: [
      { key: "blusas", name: "Blusas" },
      { key: "faldas", name: "Faldas" },
      { key: "vestidos", name: "Vestidos" },
      { key: "conjuntos", name: "Conjuntos" },
      { key: "ropa-escolar", name: "Ropa Escolar" }
    ]
  }
};

export function getProductsByCategory(category: string, subcategory?: string) {
  let filtered = products.filter(product => product.category === category);
  
  if (subcategory) {
    filtered = filtered.filter(product => product.subcategory === subcategory);
  }
  
  return filtered;
}