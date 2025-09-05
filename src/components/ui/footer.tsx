import { useState } from "react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { EmailModal } from "@/components/contact/email-modal";
import { useNewsletter } from "@/hooks/use-newsletter";
import { useToast } from "@/hooks/use-toast";
import phoneIcon from "@/assets/phone-icon.png";
import emailIcon from "@/assets/email-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";

export function Footer() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { subscribe, isLoading } = useNewsletter();
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un email válido",
        variant: "destructive"
      });
      return;
    }

    const result = await subscribe(newsletterEmail);
    
    toast({
      title: result.success ? "¡Suscripción exitosa!" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive"
    });

    if (result.success) {
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-gradient-to-b from-background to-beige border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/edp-logo.png" 
                alt="EDP Logo"
                className="h-24 w-auto"
              />
              <div className="ml-2">
                <div className="text-lg font-display font-semibold text-foreground">
                  Diseño & Confecciones
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Creamos piezas únicas que hablan por ti. Calidad, estilo y atención personalizada desde Venezuela.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              {[
                { name: "Catálogo", href: "/catalogo" },
                { name: "Pedido Personalizado", href: "/personalizado" },
                { name: "Sobre Nosotros", href: "/sobre-nosotros" },
                { name: "Testimonios", href: "/testimonios" }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Categorías</h3>
            <ul className="space-y-2">
              {[
                { name: "Mujeres", href: "/catalogo/mujeres" },
                { name: "Hombres", href: "/catalogo/hombres" }, 
                { name: "Niños y Niñas", href: "/catalogo/ninos" },
                { name: "Diseños Personalizados", href: "/personalizado" }
              ].map((category) => (
                <li key={category.name}>
                  <a
                    href={category.href}
                    className="text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                  >
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Conecta con Nosotros</h3>
            <div className="space-y-4">
              <div className="space-y-3">
                <a
                  href="tel:+584249539367"
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <img src={phoneIcon} alt="Teléfono" className="w-5 h-5" />
                  Llámanos +58 424 953 9367
                </a>
                
                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <img src={emailIcon} alt="Email" className="w-5 h-5" />
                  Escríbanos
                </button>
                
                <a
                  href="https://wa.me/584249539367"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
                  Envíanos un Mensaje
                </a>
                
                <p className="flex items-center gap-3 text-muted-foreground text-sm">
                  <span>📍</span> Venezuela, Monagas, Maturín
                </p>
              </div>
              
              {/* Social Media */}
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/30 hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/30 hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gold/30 hover:bg-gold hover:text-white transition-colors duration-300"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>

              {/* Newsletter */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Newsletter</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Recibe nuestras novedades y ofertas especiales
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-gold/20"
                    required
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="bg-gold hover:bg-gold-dark"
                    disabled={isLoading}
                  >
                    {isLoading ? "..." : "Suscribir"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Diseño & Confecciones <span translate="no">EDP</span>. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacidad" className="text-muted-foreground hover:text-gold text-sm transition-colors duration-300">
                Política de Privacidad
              </a>
              <a href="/terminos" className="text-muted-foreground hover:text-gold text-sm transition-colors duration-300">
                Términos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <EmailModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
      />
    </footer>
  );
}