import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import wilfredo from "@/assets/wilfredo.jpg";
import nohelys from "@/assets/nohelys.jpg";

const newProducts = [
  {
    id: "new-1",
    name: "Vestido de Noche Elegante",
    price: 150,
    image: nohelys,
    category: "Mujeres",
    description: "Vestido largo con detalles en encaje",
    isNew: true,
  },
  {
    id: "new-2", 
    name: "Camisa Ejecutiva Premium",
    price: 85,
    image: wilfredo,
    category: "Hombres",
    description: "Camisa de algodón egipcio con corte moderno",
    isNew: true,
  },
  {
    id: "new-3",
    name: "Blusa Casual Chic",
    price: 70,
    image: nohelys,
    category: "Mujeres", 
    description: "Blusa de seda con estampado exclusivo",
    isNew: true,
  },
  {
    id: "new-4",
    name: "Conjunto Infantil Moderno",
    price: 55,
    image: wilfredo,
    category: "Niños",
    description: "Conjunto cómodo y divertido para niños",
    isNew: true,
  },
  {
    id: "new-5",
    name: "Traje Personalizado Slim",
    price: 280,
    image: nohelys,
    category: "Personalizado",
    description: "Traje a medida con acabados de lujo",
    isNew: true,
  },
  {
    id: "new-6",
    name: "Vestido Casual Verano",
    price: 95,
    image: wilfredo,
    category: "Mujeres",
    description: "Vestido ligero perfecto para el día",
    isNew: true,
  },
];

export function NovedadesSection() {
  const { dispatch } = useCart();

  const handleAddToCart = (product: typeof newProducts[0]) => {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      },
    });
    dispatch({ type: "SET_CART_OPEN", payload: true });
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-beige/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold-light/20 border border-gold/30 mb-6">
            <Sparkles className="h-4 w-4 text-gold mr-2" />
            <span className="text-sm font-medium text-gold-dark">
              Nuevos Lanzamientos
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Novedades
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestras últimas creaciones y diseños exclusivos. Piezas únicas que marcan tendencia.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newProducts.map((product, index) => (
            <Card
              key={product.id}
              className="group overflow-hidden border-0 shadow-soft hover:shadow-card transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                {/* New Badge */}
                <Badge
                  className="absolute top-4 left-4 z-10 bg-gold text-white border-0"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Nuevo
                </Badge>

                {/* Product Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-white/90 text-foreground hover:bg-white"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white/90 border-white/90 text-foreground hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                  {product.name}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-gold">
                    ${product.price}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddToCart(product)}
                    className="border-gold text-gold hover:bg-gold hover:text-white"
                  >
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-card rounded-2xl p-8 border border-border/50">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              ¿Buscas algo específico?
            </h3>
            <p className="text-muted-foreground mb-6">
              Creamos diseños completamente personalizados adaptados a tu estilo único
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Solicitar Diseño Personalizado
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                Ver Todo el Catálogo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}