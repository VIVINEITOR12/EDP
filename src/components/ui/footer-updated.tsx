import { useState } from "react";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { Button } from "./button";
import { EmailModalUpdated } from "@/components/contact/email-modal-updated";
import phoneIcon from "@/assets/phone-icon.png";
import emailIcon from "@/assets/email-icon.png";
import whatsappIcon from "@/assets/whatsapp-icon.png";
import { useSiteConfig } from "@/hooks/use-site-config";

export function FooterUpdated() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { config, isLoading } = useSiteConfig();

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

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Información de Contacto</h3>
            <div className="space-y-3">
              {config.contact_phone && (
                <a
                  href={`tel:${config.contact_phone}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <img src={phoneIcon} alt="Teléfono" className="w-5 h-5" />
                  {config.contact_phone}
                </a>
              )}
              
              {config.contact_email && (
                <a
                  href={`mailto:${config.contact_email}`}
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <img src={emailIcon} alt="Email" className="w-5 h-5" />
                  {config.contact_email}
                </a>
              )}
              
              {config.contact_address && (
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5" />
                  {config.contact_address}
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Redes Sociales</h3>
            <div className="space-y-3">
              {config.social_whatsapp && (
                <a
                  href={config.social_whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              )}
              
              {config.social_instagram && (
                <a
                  href={config.social_instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
              )}
              
              {config.social_facebook && (
                <a
                  href={config.social_facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-300 text-sm"
                >
                  <Facebook className="h-4 w-4" />
                  Facebook
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/catalogo" className="text-muted-foreground hover:text-gold text-sm">Catálogo</a></li>
              <li><a href="/personalizado" className="text-muted-foreground hover:text-gold text-sm">Pedido Personalizado</a></li>
              <li><a href="/sobre-nosotros" className="text-muted-foreground hover:text-gold text-sm">Sobre Nosotros</a></li>
              <li><a href="/testimonios" className="text-muted-foreground hover:text-gold text-sm">Testimonios</a></li>
            </ul>
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
        config={config}
      />
    </footer>
  );
}
