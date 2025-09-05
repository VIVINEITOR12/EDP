import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard } from "@/components/catalog/product-card";
import { Product } from "@/hooks/use-products";

interface RelatedProductsProps {
  currentProductId: string;
  category: string;
  subcategory?: string;
}

export function RelatedProducts({ currentProductId, category, subcategory }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('products')
          .select('*')
          .eq('status', 'active')
          .neq('id', currentProductId); // Exclude current product

        // First try to get products from same subcategory
        if (subcategory) {
          query = query.eq('category', category).eq('subcategory', subcategory);
        } else {
          // If no subcategory, get from same category
          query = query.eq('category', category);
        }

        const { data, error } = await query.limit(4);

        if (error) throw error;

        // If we don't have enough products from subcategory, get more from category
        if (data && data.length < 4 && subcategory) {
          const { data: categoryData, error: categoryError } = await supabase
            .from('products')
            .select('*')
            .eq('status', 'active')
            .eq('category', category)
            .neq('id', currentProductId)
            .limit(4 - data.length);

          if (categoryError) throw categoryError;
          
          // Combine and remove duplicates
          const combined = [...data, ...(categoryData || [])];
          const unique = combined.filter((product, index, self) => 
            index === self.findIndex(p => p.id === product.id)
          );
          
          setProducts(unique.slice(0, 4));
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentProductId && category) {
      fetchRelatedProducts();
    }
  }, [currentProductId, category, subcategory]);

  if (isLoading) {
    return (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-center mb-8">Productos Relacionados</h2>
        <div className="text-center">Cargando productos relacionados...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // Don't show section if no related products
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">Productos Relacionados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}