import { Star, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-context";
import { Product } from "@/hooks/use-products";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useProductReviews } from "@/hooks/use-product-reviews";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const navigate = useNavigate();
  const { rating } = useProductReviews(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const priceValue = typeof product.price === 'object' ? product.price.usd : product.price;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: priceValue,
        image: product.images?.[0] || product.image || "/api/placeholder/300/400",
        quantity: 1
      }
    });
    
    toast.success(`${product.name} agregado al carrito`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const priceValue = typeof product.price === 'object' ? product.price.usd : product.price;

  return (
    <div 
      className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 border border-border/50 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Product Image */}
      <div className="aspect-[3/4] overflow-hidden bg-muted">
        <img
          src={product.images?.[0] || product.image || "/api/placeholder/300/400"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 text-sm">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= Math.floor(rating.avgRating)
                    ? "fill-gold text-gold"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            {rating.reviewCount > 0 ? `(${rating.reviewCount})` : '(Sin reseñas)'}
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-foreground">
            ${priceValue}
          </span>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-medium"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar
        </Button>
      </div>
    </div>
  );
}
