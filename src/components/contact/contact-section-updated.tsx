import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useSiteConfig } from "@/hooks/use-site-config";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactSectionUpdated() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { config } = useSiteConfig();

  const form = useForm<ContactFormData>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Importar el servicio de email dinámicamente
      const { emailService } = await import("@/services/email-service");
      
      // Enviar email usando el servicio
      const success = await emailService.sendContactEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
        to_email: config.contact_email || 'atencioncliente.edp@gmail.com'
      });

      if (success) {
        toast({
          title: "Mensaje Enviado",
          description: "Gracias por contactarnos. Te responderemos pronto.",
        });
        form.reset();
      } else {
        throw new Error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error enviando formulario:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al enviar el mensaje. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-beige/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-elegant font-bold text-foreground mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o quieres solicitar un diseño personalizado? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Información de Contacto
              </h2>
              <div className="space-y-4">
                {config.contact_phone && (
                  <div className="flex items-center space-x-4">
                    <div className="bg-gold/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Teléfono</p>
                      <p className="text-muted-foreground">{config.contact_phone}</p>
                    </div>
                  </div>
                )}
                
                {config.contact_email && (
                  <div className="flex items-center space-x-4">
                    <div className="bg-gold/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-muted-foreground">{config.contact_email}</p>
                    </div>
                  </div>
                )}
                
                {config.contact_address && (
                  <div className="flex items-center space-x-4">
                    <div className="bg-gold/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ubicación</p>
                      <p className="text-muted-foreground">{config.contact_address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Horarios de Atención
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lunes - Viernes:</span>
                  <span className="text-foreground">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sábado:</span>
                  <span className="text-foreground">9:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domingo:</span>
                  <span className="text-foreground">Cerrado</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un Mensaje</CardTitle>
              <CardDescription>
                Completa el formulario y nos pondremos en contacto contigo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Tu nombre completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ 
                      required: "El email es requerido",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Email inválido"
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="tu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{ required: "El teléfono es requerido" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="+58 412 345 6789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "El mensaje es requerido" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensaje o Motivo de Contacto</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Cuéntanos sobre tu proyecto o consulta..."
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-dark hover:to-gold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
