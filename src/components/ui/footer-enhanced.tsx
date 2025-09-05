import { useState } from "react";
import { Instagram, Facebook, MessageCircle, Mail } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { EmailModalUpdated } from "@/components/contact/email-modal-updated";
import { useNewsletter } from "@/hooks/use-newsletter";
import { useSiteConfig } from "@/hooks/use-site-config";
import { useToast } from "@/hooks/use-toast";
import phoneIcon from "@/assets/phone-icon.png";
import emailIcon from "@/assets/email-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";

export function FooterEnhanced() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { config, isLoading } = useSiteConfig();
  const { subscribe, isLoading: isSubscribing } = useNewsletter();
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    const result = await subscribe(newsletterEmail);
    
    if (result.success) {
      toast({
        title: "¡Suscripción exitosa!",
        description: "Te has suscrito al newsletter exitosamente.",
      });
      setNewsletterEmail("");
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando configuración...</div>;
  }

  return (
    <footer className="bg-gradient-to-b from-background to-beige border-t border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="text-2xl font-elegant font-bold bg-gradient-to-r from-gold to-gold-dark bg-clip-text text-transparent">
                <span translate="no">EDP</span>
              </div>
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

          {/* Connect with Us */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Conecta con nosotros</h3>
            <div className="space-y-3">
              <a
                href={`tel:+584249539367`}
                className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
              >
                <img src={phoneIcon} alt="Teléfono" className="w-5 h-5" />
                +58 424 953 9367
              </a>
              
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
              >
                <img src={emailIcon} alt="Email" className="w-5 h-5" />
                Escríbenos
              </button>
              
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <img src={whatsappIcon} alt="Dirección" className="w-5 h-5" />
                {config.contact_address || "Venezuela, Monagas, Maturín, Sector Centro Calle Bomboná"}
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Síguenos</h3>
            <div className="space-y-3">
              <a
                href={`https://wa.me/584249539367`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              
              <a
                href={`https://instagram.com/Creacionesedp_2`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
              >
                <Instagram className="h-4 w-4" />
                @Creacionesedp_2
              </a>
              
              <a
                href={`https://facebook.com/Creacionesedp_2`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
              >
                <Facebook className="h-4 w-4" />
                @Creacionesedp_2
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Suscríbete para recibir nuestras últimas noticias y ofertas especiales
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="h-9"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="w-full bg-gold hover:bg-gold-dark text-white"
                size="sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                {isSubscribing ? "Suscribiendo..." : "Suscribirse"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm">
              © 2025 Diseño & Confecciones <span translate="no">EDP</span>. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="/privacidad" className="text-muted-foreground hover:text-gold text-sm">
                Política de Privacidad
              </a>
              <a href="/terminos" className="text-muted-foreground hover:text-gold text-sm">
                Términos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <EmailModalUpdated 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        config={{
          contact_phone: "+58 424 953 9367",
          contact_email: "atencioncliente.edp@gmail.com",
          contact_address: config.contact_address || "Venezuela, Monagas, Maturín",
          social_whatsapp: "https://wa.me/584249539367",
          social_instagram: "https://instagram.com/Creacionesedp_2",
          social_facebook: "https://facebook.com/Creacionesedp_2"
        }}
      />
    </footer>
  );
}