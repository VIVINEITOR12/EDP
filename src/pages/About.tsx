import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Heart, Award, Users, Sparkles } from "lucide-react";
import atelierWorkspace from "@/assets/atelier-workspace.jpg";
const About = () => {
  return <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-beige/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-fade-in">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold-light/20 border border-gold/30 mb-6">
                  <Heart className="h-4 w-4 text-gold mr-2" />
                  <span className="text-sm font-medium text-gold-dark">Nuestra Historia</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-elegant font-bold text-foreground mb-6">
                  Pasión por la
                  <span className="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
                    {" "}Moda
                  </span>
                </h1>
                
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Diseño & Confecciones <span translate="no">EDP</span> nació como un proyecto familiar con raíces en la pasión por la moda, 
                  la elegancia y el trabajo hecho a mano. Desde un pequeño local en Venezuela, hemos vestido a 
                  cientos de personas que buscan más que ropa: buscan identidad, confianza y estilo.
                </p>
                
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">500+</div>
                    <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">5+</div>
                    <div className="text-sm text-muted-foreground">Años de Experiencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gold">100+</div>
                    <div className="text-sm text-muted-foreground">Diseños Únicos</div>
                  </div>
                </div>
              </div>
              
              <div className="animate-scale-in">
                <img src={atelierWorkspace} alt="Atelier de Diseño & Confecciones EDP" className="rounded-2xl shadow-elegant w-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-gradient-to-b from-background to-beige/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
                Nuestra Misión
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Crear piezas que hablen por ti, sin importar la edad o el estilo. Cada prenda es diseñada 
                con cariño, compromiso y dedicación, porque creemos que la moda es una forma de expresión personal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="bg-gradient-to-br from-gold-light to-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Calidad Superior</h3>
                <p className="text-muted-foreground">
                  Utilizamos los mejores materiales y técnicas de confección para garantizar durabilidad y elegancia.
                </p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-gold-light to-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Atención Personalizada</h3>
                <p className="text-muted-foreground">
                  Cada cliente recibe un trato único y personalizado, desde la consulta inicial hasta la entrega final.
                </p>
              </div>

              <div className="text-center group">
                <div className="bg-gradient-to-br from-gold-light to-gold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Diseños Únicos</h3>
                <p className="text-muted-foreground">
                  Creamos piezas originales que reflejan la personalidad y estilo de cada cliente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gradient-to-b from-beige/20 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-8">
              Nuestros Valores
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">Tradición Familiar</h3>
                <p className="text-muted-foreground">
                  Mantenemos vivas las técnicas tradicionales de confección mientras incorporamos tendencias modernas.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">Compromiso Social</h3>
                <p className="text-muted-foreground">
                  Apoyamos el talento local y contribuimos al desarrollo de la industria textil venezolana.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">Sostenibilidad</h3>
                <p className="text-muted-foreground">
                  Promovemos la moda consciente con prendas duraderas que trascienden las tendencias pasajeras.
                </p>
              </div>
              
              <div className="bg-card rounded-xl p-6 shadow-soft border border-border/50">
                <h3 className="text-xl font-semibold text-foreground mb-3">Innovación</h3>
                <p className="text-muted-foreground">
                  Combinamos técnicas artesanales con tecnología moderna para ofrecer resultados excepcionales.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-b from-background to-beige/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-6">
              ¿Listo para Crear Algo Único?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Únete a nuestra familia de clientes satisfechos y descubre lo que significa vestir con estilo y elegancia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/catalogo" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold transition-all duration-300 shadow-lg hover:shadow-xl">
                Explorar Catálogo
              </a>
              <a href="/personalizado" className="inline-flex items-center justify-center px-8 py-3 border border-gold text-base font-medium rounded-full text-gold hover:bg-gold hover:text-white transition-all duration-300">
                Diseño Personalizado
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      <WhatsAppButton />
    </div>;
};
export default About;