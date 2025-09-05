import { ProductCard } from "./product-card";
import { Product } from "@/hooks/use-products";

interface ProductGridProps {
  products: Product[];
  title?: string;
  isLoading?: boolean; 
  emptyMessage?: string;
}

export function ProductGrid({ products, title, isLoading = false, emptyMessage = "No hay productos disponibles" }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">⏳</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Cargando productos...
          </h3>
          <p className="text-muted-foreground">
            Por favor espera un momento.
          </p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">👗</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {emptyMessage}
          </h3>
          <p className="text-muted-foreground">
            Pronto agregaremos más productos a esta categoría.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <h3 className="text-xl font-semibold text-foreground mb-6">
          {title}
        </h3>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}