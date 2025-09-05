import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number | { usd: number; bs: number };
  description?: string;
  image?: string;
  images?: string[];
  rating: number;
  reviewCount?: number;
  display_order?: number;
  stock?: number;
  status?: string;
  sku?: string;
  sizes?: string[];
  colors?: string[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar productos desde Supabase
      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active') // Solo productos activos
        .order('display_order', { ascending: true });

      if (supabaseError) throw supabaseError;

      // Transformar los datos para mantener compatibilidad
      const transformedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        subcategory: product.subcategory || undefined,
        price: product.price,
        description: product.description || undefined,
        image: product.image || (product.images && product.images[0]) || undefined,
        images: product.images || undefined,
        rating: product.rating || 4.5, // Rating por defecto
        reviewCount: Math.floor(Math.random() * 50) + 5, // ReviewCount simulado
        display_order: product.display_order || 0,
        stock: product.stock || 0,
        status: product.status || 'active',
        sku: product.sku || undefined,
        sizes: product.sizes || undefined,
        colors: product.colors || undefined,
      }));

      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error loading products:', err);
      setProducts([]); // Asegurar que no se muestren productos estáticos en caso de error
    } finally {
      setIsLoading(false);
    }
  };

  const getProductsByCategory = (category: string, subcategory?: string): Product[] => {
    return products.filter(product => {
      const matchesCategory = product.category === category;
      if (subcategory) {
        return matchesCategory && product.subcategory === subcategory;
      }
      return matchesCategory;
    });
  };

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    getProductsByCategory
  };
}
