import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import { CustomOrderForm } from "./custom-order-form";
import { useCustomDesigns } from "@/hooks/use-custom-designs";

export function CustomOrderEnhanced() {
  const { designs, isLoading } = useCustomDesigns();
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Cargando diseños...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background via-beige to-gold-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-elegant font-bold text-foreground mb-6">
            Inspírate con algunos de nuestros
            <span className="block bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              diseños personalizados
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Cada pieza cuenta una historia única. Descubre la versatilidad y creatividad 
            de nuestros diseños hechos especialmente para cada cliente.
          </p>
        </div>
      </section>

      {/* Design Showcase */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {designs.map((design, index) => (
              <Card key={design.id} className="group hover:shadow-xl transition-all duration-300 border border-border/50 overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-gold-light/20 via-beige to-gold/10 relative overflow-hidden">
                  {design.image_url ? (
                    <img 
                      src={design.image_url} 
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-6">
                        <Badge variant="secondary" className="text-xs">
                          Próximamente
                        </Badge>
                        <div className="text-2xl font-elegant font-bold text-gold mt-2">
                          EDP
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-gold transition-colors">
                    {design.title}
                  </h3>
                  {design.description && (
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {design.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button 
              onClick={scrollToForm}
              size="lg"
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <ArrowDown className="w-5 h-5 mr-2 animate-bounce" />
              ¿Tienes una idea en mente? Haz tu pedido personalizado aquí
            </Button>
          </div>
        </div>
      </section>

      {/* Custom Order Form */}
      <div ref={formRef}>
        <CustomOrderForm />
      </div>
    </div>
  );
}