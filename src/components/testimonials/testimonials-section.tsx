import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "María Rodríguez",
    rating: 5,
    comment: "Increíble calidad y atención al detalle. Mi vestido personalizado quedó perfecto, exactamente como lo imaginé. El proceso fue muy profesional.",
    location: "Caracas, Venezuela"
  },
  {
    id: 2,
    name: "Carlos Mendoza",
    rating: 5,
    comment: "Excelente servicio. Las camisas que encargué tienen una calidad superior y el ajuste es perfecto. Definitivamente volveré a comprar.",
    location: "Maracaibo, Venezuela"
  },
  {
    id: 3,
    name: "Ana García",
    rating: 5,
    comment: "Me encanta la atención personalizada que ofrecen. Cada prenda está hecha con mucho cuidado y amor. Son únicos en su estilo.",
    location: "Valencia, Venezuela"
  },
  {
    id: 4,
    name: "Roberto Silva",
    rating: 5,
    comment: "La calidad de los materiales y la confección es excepcional. Mi traje de gala quedó espectacular y recibí muchos cumplidos.",
    location: "Barquisimeto, Venezuela"
  },
  {
    id: 5,
    name: "Elizabeth Blanco",
    rating: 4,
    comment: "El vestido quedó espectacular, pero el pedido tardó un poco más de lo esperado. Aun así, lo recomiendo 100%.",
    location: "Valencia, Venezuela"
  },
  {
    id: 6,
    name: "Lucía Herrera",
    rating: 5,
    comment: "Servicio impecable desde el primer contacto hasta la entrega. La ropa para mis hijos es hermosa y de excelente calidad.",
    location: "Maracay, Venezuela"
  },
  {
    id: 7,
    name: "Diego Morales",
    rating: 5,
    comment: "Profesionalismo y creatividad en cada diseño. Me ayudaron a crear exactamente lo que tenía en mente. Altamente recomendado.",
    location: "Puerto Ordaz, Venezuela"
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-beige/20 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestro mayor orgullo
          </p>
          
          {/* Overall Rating */}
          <div className="flex items-center justify-center mt-6 space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">4.3</span>
            <span className="text-muted-foreground">de 500+ reseñas</span>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-card rounded-xl p-6 shadow-soft hover:shadow-card transition-all duration-300 animate-fade-in border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="flex items-start justify-between mb-4">
                <Quote className="h-8 w-8 text-gold-light" />
                
                {/* Rating */}
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= testimonial.rating
                          ? "fill-gold text-gold"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>

              {/* Customer Info */}
              <div className="border-t border-border/30 pt-4">
                <div className="font-semibold text-foreground">
                  {testimonial.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.location}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿Quieres ser parte de nuestros clientes satisfechos?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/catalogo"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold transition-all duration-300"
            >
              Ver Catálogo
            </a>
            <a
              href="/personalizado"
              className="inline-flex items-center justify-center px-6 py-3 border border-gold text-base font-medium rounded-lg text-gold hover:bg-gold hover:text-white transition-all duration-300"
            >
              Diseño Personalizado
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}