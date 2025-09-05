import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { emailService } from "@/services/email-service";

interface EmailModalUpdatedProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    contact_phone: string;
    contact_email: string;
    contact_address: string;
    social_whatsapp: string;
    social_instagram: string;
    social_facebook: string;
  };
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phonePrefix: string;
  phoneNumber: string;
  message: string;
}

export function EmailModalUpdated({ isOpen, onClose, config }: EmailModalUpdatedProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: "+58",
    phoneNumber: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const success = await emailService.sendEmailModal({
        ...formData,
        to_email: config.contact_email || 'atencioncliente.edp@gmail.com'
      });

      if (success) {
        toast({
          title: "Correo enviado",
          description: "Su mensaje ha sido enviado exitosamente. Le responderemos pronto.",
        });

        // Reset form and close modal
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phonePrefix: "+58",
          phoneNumber: "",
          message: ""
        });
        onClose();
      } else {
        toast({
          title: "Error",
          description: "Hubo un problema al enviar el mensaje. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Envíenos un correo electrónico
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nombre de pila</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Dirección de correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phonePrefix">Prefijo</Label>
              <Input
                id="phonePrefix"
                value={formData.phonePrefix}
                onChange={(e) => handleInputChange("phonePrefix", e.target.value)}
                placeholder="+58"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="phoneNumber">Número de teléfono</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="424 953 9367"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Consulta o comentario</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Escriba su mensaje aquí..."
              maxLength={1000}
              rows={4}
              required
              className="resize-none"
            />
            <div className="text-right text-sm text-muted-foreground mt-1">
              {formData.message.length}/1000 caracteres
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gold hover:bg-gold-dark"
            >
              {isSubmitting ? "Enviando..." : "Enviar correo electrónico"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
