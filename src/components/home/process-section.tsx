import { MessageCircle, Palette, Scissors, Package } from "lucide-react";

export function ProcessSection() {
  const steps = [
    {
      icon: MessageCircle,
      title: "CONSULTA",
      description: "Conversamos sobre tus ideas, medidas y preferencias."
    },
    {
      icon: Palette,
      title: "DISEÑO", 
      description: "Creamos bocetos y seleccionamos materiales contigo."
    },
    {
      icon: Scissors,
      title: "CONFECCIÓN",
      description: "Nuestros expertos dan vida a tu diseño con precisión."
    },
    {
      icon: Package,
      title: "ENTREGA",
      description: "Tu prenda perfecta, lista para brillar."
    }
  ];

  const advantages = [
    {
      title: "MATERIALES PREMIUM",
      description: "Solo trabajamos con telas de primera calidad."
    },
    {
      title: "ATENCIÓN PERSONALIZADA", 
      description: "Cada cliente recibe trato exclusivo."
    },
    {
      title: "EXPERIENCIA COMPROBADA",
      description: "500+ clientes satisfechos nos avalan."
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Nuestro Proceso */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro Proceso
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            "Cómo Creamos Tu Prenda Perfecta"
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="group">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gold to-gold-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-gold via-gold-light to-transparent transform translate-x-1/2"></div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ¿Por Qué Elegirnos? */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            ¿Por Qué Elegirnos?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {advantages.map((advantage, index) => (
              <div key={index} className="group">
                <div className="p-6 rounded-xl bg-card border border-border/50 hover:shadow-card transition-all duration-300 group-hover:border-gold/20">
                  <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-gold transition-colors">
                    {advantage.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {advantage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}