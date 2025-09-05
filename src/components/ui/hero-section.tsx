import { Button } from "./button";
import { Sparkles, Heart, Star } from "lucide-react";
import heroImage from "@/assets/hero-fashion.jpg";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-beige to-gold-light/20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Diseño & Confecciones EDP - Atelier de moda elegante"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-fade-in">
        <Sparkles className="h-6 w-6 text-gold animate-pulse" />
      </div>
      <div className="absolute top-40 right-20 animate-fade-in-delayed">
        <Heart className="h-8 w-8 text-gold-light animate-pulse" />
      </div>
      <div className="absolute bottom-32 left-20 animate-fade-in">
        <Star className="h-5 w-5 text-gold animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-elegant font-bold text-foreground mb-6">
            <span className="bg-gradient-to-r from-gold-dark via-gold to-gold-light bg-clip-text text-transparent">
              Diseño &
            </span>
            <br />
            <span className="text-foreground">Confecciones</span>
            <br />
            <img 
              src="/edp-logo.png" 
              alt="EDP Logo"
              className="h-20 md:h-24 lg:h-32 w-auto mx-auto"
            />
          </h1>

          {/* Slogan */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-4 font-medium">
            Elegancia que se adapta a ti
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            Creamos piezas únicas que hablan por ti. Desde ropa casual hasta elegante, 
            y diseños completamente personalizados. Calidad, estilo y atención personalizada.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <a href="/catalogo">Explorar Catálogo</a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold text-gold hover:bg-gold hover:text-white font-semibold px-8 py-3 rounded-full transition-all duration-300"
            >
              <a href="/personalizado">Diseño Personalizado</a>
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold">500+</div>
              <div className="text-sm text-muted-foreground">Clientes Felices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold">200+</div>
              <div className="text-sm text-muted-foreground">Diseños Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold">5★</div>
              <div className="text-sm text-muted-foreground">Calificación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gold rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}