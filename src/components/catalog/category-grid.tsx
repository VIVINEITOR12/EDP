import { Button } from "@/components/ui/button";
import nohelys from "@/assets/nohelys.jpg";
import wilfredo from "@/assets/wilfredo.jpg";
import niños from "@/assets/niños.jpg";
import niñas from "@/assets/niñas.jpg";
import perso from "@/assets/perso.jpg";
const categories = [
  {
    title: "Mujeres",
    subtitle: "Elegancia y estilo",
    image: nohelys,
    subcategories: ["Casual", "Vestidos", "Pantalones", "Chaquetas"],
    link: "/catalogo/mujeres"
  },
  {
    title: "Hombres", 
    subtitle: "Sofisticación masculina",
    image: wilfredo,
    subcategories: ["Camisas", "Pantalones", "Chaquetas", "Conjuntos"],
    link: "/catalogo/hombres"
  },
  {
    title: "Niños",
    subtitle: "Comodidad y diversión",
    image: niños,
    subcategories: ["Camisas", "Pantalones", "Uniformes", "Conjuntos"],
    link: "/catalogo/ninos"
  },
  {
    title: "Niñas",
    subtitle: "Estilo y ternura",
    image: niñas,
    subcategories: ["Vestidos", "Blusas", "Conjuntos", "Escolar"],
    link: "/catalogo/ninas"
  },
  {
    title: "Diseños Personalizados",
    subtitle: "Tu estilo único",
    image: perso,
    subcategories: ["Medidas exactas", "Diseño exclusivo", "Asesoría completa"],
    link: "/personalizado"
  }
];

export function CategoryGrid() {
  return (
    <section className="py-16 bg-gradient-to-b from-background to-beige/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Nuestras Colecciones
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra amplia gama de estilos para cada ocasión y personalidad
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className={`group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-card transition-all duration-500 animate-scale-in ${
                index === 4 ? 'md:col-span-2 xl:col-span-1' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-1">{category.title}</h3>
                  <p className="text-white/80 text-sm mb-3">{category.subtitle}</p>
                  
                  {/* Subcategories */}
                  <div className="mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 3).map((sub) => (
                        <span key={sub} className="text-xs bg-white/20 rounded-full px-2 py-1">
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 3 && (
                        <span className="text-xs bg-white/20 rounded-full px-2 py-1">
                          +{category.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="bg-white/90 text-foreground hover:bg-white font-medium"
                  >
                    <a href={category.link}>Explorar</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            ¿No encuentras lo que buscas?
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold text-white font-semibold"
          >
            <a href="/personalizado">Solicita un Diseño Personalizado</a>
          </Button>
        </div>
      </div>
    </section>
  );
}