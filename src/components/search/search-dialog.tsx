import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useProducts } from "@/hooks/use-products";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/utils/price-utils";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { products, isLoading } = useProducts();
  const navigate = useNavigate();

  const filteredProducts = products.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-gold" />
            Buscar Productos
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                Todos
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="max-h-[300px] overflow-y-auto">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Cargando productos...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 bg-card rounded-lg border border-border/50 hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/product/${product.id}`);
                    }}
                  >
                    <div>
                      <h4 className="font-medium text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="text-gold font-semibold">
                      {formatPrice(product.price)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No se encontraron productos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 && (
            <div className="pt-4 border-t border-border/50">
              <Button
                className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold"
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
                }}
              >
                Ver Todos los Resultados en Catálogo
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}